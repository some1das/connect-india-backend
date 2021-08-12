const User=require("../models/user")
exports.getUserById = (req, res, next, id) => {
    User.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "no usre found in DB",
        });
      }
      req.profile = user;
      next();
    });
  };
  exports.singleUserById=(req,res)=>{
    return res.status(200).json(req.profile)
  }

  exports.getAllUsers=(req,res)=>{
    User.find((err,users)=>{
      if(err)
      {
        return res.status(404).json({
          error:"unable to fetch users"
        })
      }
      return res.status(200).json(users)
    })
  }