const formidable = require("formidable");
const Post = require("../models/post");
const fs = require("fs");
const User = require("../models/user");
exports.createPost = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        message: "problem with image",
      });
    }
    //destructure the fields
    const { content } = fields;

    //TODO: restrictions on fields

    let post = new Post(fields);

    if (file.image) {
      if (file.image.size > 3000000) {
        return res.status(400).json({
          message: "file is too big!!",
        });
      }
      post.image.data = fs.readFileSync(file.image.path);
      post.image.contentType = file.image.type;
      
      post.content = content;
    }
    const { name, email, _id } = req.profile;
      post.author = name;
      post.email = email;
      post.authorId = _id;
    //save to the DB
    post.save((err, post) => {
      if (err) {
        return res.status(400).json({
          message: "saving post failed",
        }); 
      }
      User.findByIdAndUpdate(post.authorId,{
        $push:{
          postIds:post._id
        }
      },(err,newU)=>{
        if(err){
          return res.status(400).json({
            error:"Unable to update post id array"
          })
        }
        res.json(post);
      })
      
      
    });
  });
};

exports.getAllPosts = (req, res) => {
  Post.find((error, posts) => {
    if (error) {
      return res.status(400).json({
        error: "unable to fetch the posts",
      });
    } else {
      posts.forEach((e) => {
        e.image = undefined;
      });
      posts.reverse();
      return res.status(200).json({
        posts,
      });
    }
  });
};

exports.getPostById = (req, res, next, id) => {
  Post.findById(id, (error, post) => {
    if (error) {
      return res.status(400).json({
        error: error,
      });
    } else {
      req.post = post;
      next();
    }
  });
};
exports.getSinglePost=(req,res)=>{
  
  
 
  return res.status(200).json(req.post)
}

exports.provideImage = (req, res) => {
  if (req.post.image.data) {
    res.set("content-type", req.post.image.contentType);
    return res.send(req.post.image.data);
  }
  else
  {
    return res.send("https://upload.wikimedia.org/wikipedia/commons/thumb/0/0d/Golden_Pagoda_in_Arunachal_Pradesh_%28photo_-_Jim_Ankan_Deka%29.jpg/420px-Golden_Pagoda_in_Arunachal_Pradesh_%28photo_-_Jim_Ankan_Deka%29.jpg")
  }
};

exports.deletePost = (req, res) => {
  const userId = req.profile._id;
  const authorId = req.post.authorId;
  if (toString(userId) === toString(authorId)) {
    Post.findByIdAndDelete(req.post._id,(err,post)=>{
      if(err)
      {
        return res.status(400).json({
          error:"unable to delete"
        })
      }
      User.findByIdAndUpdate(userId,{
        $pull:{
          postIds:req.post._id
        }
      },(err,upadtedUser)=>{
        if(err){
          return res.status(400).json({
            error:"sorry!!"
          })
        }
        return res.status(200).json({
          message:"success delete"
        })
      })
      
    })
  } else {
    console.log(userId+"---"+authorId)
    return res.status(400).json({
      error: "access denied1",
    });
  }
};
