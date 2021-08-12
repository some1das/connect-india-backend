const mongoose=require("mongoose")
const {ObjectId}=mongoose.Schema.Types
const User=require("./user")
const storySchema=new mongoose.Schema({
    author:{
        type:String,

    },
    authorId:{
        type:ObjectId,
        ref:User
    },
    image:{
        data:Buffer,
        contentType:String
    },
    content:{
        type:String,
        trim:true
    }
},{timestamps:true})

module.exports=mongoose.model("Story",storySchema)