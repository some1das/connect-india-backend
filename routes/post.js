const express=require("express")
const { isSignedIn } = require("../controllers/auth")
const { createPost, getAllPosts, provideImage,getPostById, deletePost, getSinglePost } = require("../controllers/post")
const { getUserById } = require("../controllers/user")
const router=express.Router()
router.param("userId",getUserById)
router.param("postId",getPostById)
router.post("/post/create/:userId",isSignedIn,createPost)
router.get("/post/all/:userId",isSignedIn,getAllPosts)
router.get("/post/photo/:postId",provideImage)
router.delete("/post/delete/:postId/:userId",isSignedIn,deletePost)
router.get("/post/postbyid/:postId",getSinglePost)

module.exports=router