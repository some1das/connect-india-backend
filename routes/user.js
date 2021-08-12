const { singleUserById,getUserById, getAllUsers } = require("../controllers/user")

const router=require("express").Router()
router.param("userId",getUserById)

router.get("/singleUser/:userId",singleUserById)
router.get("/user/all",getAllUsers)

module.exports=router