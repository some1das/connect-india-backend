const mongoose = require("mongoose")
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    address: {
        state: {
            type: String,
            trim: true
        },
        district: {
            type: String,
            trim: true
        },
        pin: {
            type: String,
            trim: true
        }
    },
    password: {
        type: String,
        required: true
    },
    postIds: [String],
    chats: [{ chatId: String, userId: String }],
    followers: [String],
    following: [String]

}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)