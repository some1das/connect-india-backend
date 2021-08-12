const User = require("../models/user");
const expressJwt=require("express-jwt")
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")
require("dotenv").config()
require("dotenv").config()
//-----------------general things--------------------------------
//Protected routs
exports.isSignedIn = expressJwt({
    secret: process.env.SECRET,
    userProperty: "auth",
    algorithms: ["HS256"],
  });

// ---------------------user auth related codes are here---------------------
exports.usersignup = async (req, res) => {
  const { name, email, password } = req.body;
  const data = {
    name: name,
    email: email,
    password: password,
  };
  const saltRounds = 10;
  bcrypt.hash(password, saltRounds, async function (err, hash) {
    if (err) {
      return res.status(400).json({
        error: "not able to hash password",
      });
    } else {
      data.password = hash;
      const user = await new User(data);
      user.save((err, user) => {
        if (err) {
          return res.status(400).json({
            error: "failed to signup...",
          });
        } else {
          return res.status(200).json(user);
        }
      });
    }
  });
};

exports.usersignin=(req,res)=>{
    const {email,password}=req.body
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(404).json({
                error:"email doesn't exist"
            })
        }
        else{
            const dbPassword=user.password;
            bcrypt.compare(password,dbPassword,(err,result)=>{
                if(err)
                {
                    console.log(err)
                    return res.status(400).json({
                        error:"problem with password"
                    })
                }
                else if(!result)
                {
                    return res.status(400).json({
                        error:"wrong password"
                    })
                }
                else if(result)
                {
                   const token= jwt.sign({_id:user._id,email:user.email},process.env.SECRET)
                   return res.status(200).json({token,user})
                    
                }
            })
        }
    })
}



