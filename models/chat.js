const mongoose=require("mongoose")

const chatSchema=new mongoose.Schema({
    u1id:{
        type:String,
        required:true
    },
    u2id:{
        type:String,
        required:true
    },
    
    messages:[{
        text:{
            type:String,

        },
        authorId:{
            type:String
        },
        time:{
            type:Date
        }
        
    }]
})

module.exports=mongoose.model("Chat",chatSchema)