const express=require("express")
const { isSignedIn } = require("../controllers/auth")
const { getAllPosts } = require("../controllers/post")
const { getAllStories, createStory, provideImage, getStoryById } = require("../controllers/story")
const { getUserById } = require("../controllers/user")
const router=express.Router()
//parameters are here
router.param("userId",getUserById)
router.param("storyId",getStoryById)
//All read routes are here
router.get("/story/all/",getAllStories)
router.get("/story/image/:storyId",provideImage)
//All write routes are here
router.post("/story/create/:userId",isSignedIn,createStory)

//All delete routes are here


module.exports=router