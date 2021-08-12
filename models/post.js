const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;
const User = require("./user");

const postSchema = new mongoose.Schema({
  author: {
    type: String,
    trim: true,
  },
  authorId: {
    type: ObjectId,
    ref: User,
  },
  email: {
    type: String,
  },
  content: {
    type: String,
    trim: true,
  },
  image: {
    data: Buffer,
    contentType: String
  },
  likes:{
      type:Number,
      default:0
  }
});

module.exports= mongoose.model("Post",postSchema)