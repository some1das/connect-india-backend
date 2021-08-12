const User=require("../models/user")
const Story=require("../models/Story")
const formidable=require("formidable")
const fs=require("fs")
exports.getAllStories=(req,res)=>{
    Story.find((err,stories)=>{
        if(err){
            return res.status(404).json({
                error:"something went wrong"
            })
        }
        stories.forEach((story)=>story.image=undefined)
        
        return res.status(200).json(stories)
    })

}

exports.createStory=(req,res)=>{
    let form=new formidable.IncomingForm()
    form.keepExtensions=true

    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"problem with image"
            })
        }
        const {content}=fields
        let story=new Story(fields)
        if(file.image)
        {
            if(file.image.size>3*1000*1000)
            {
                return res.status(400).json({
                    error:"image is too large"
                })
            }
            story.image.data = fs.readFileSync(file.image.path);
            story.image.contentType = file.image.type;
            const { name, email, _id } = req.profile;
            story.author=name;
            story.authorId=_id;
            story.content=content
            

        }
        story.save((err,post)=>{
            if(err){
                return res.status(400).json({
                    error:"something went wrong..."
                })
            }
            post.image=undefined;
            return res.status(200).json(post)
        })
    })
}
exports.provideImage = (req, res) => {
    if (req.story.image.data) {
      res.set("content-type", req.story.image.contentType);
      return res.send(req.story.image.data);
    }
  };

  exports.getStoryById=(req,res,next,id)=>{
    Story.findById(id,(err,story)=>{
        if(err){
            return res.status(400).json({
                error:err
            })
        }
        req.story=story
        next()
    })
  }