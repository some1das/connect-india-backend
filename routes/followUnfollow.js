const express = require("express")
const { isSignedIn } = require("../controllers/auth")
const { setFollow, setUnfollow, followCheck } = require("../controllers/followUnfollow")
const router = express.Router()

router.post("/follow", isSignedIn, setFollow)
router.post("/unfollow", isSignedIn, setUnfollow)
router.post("/followCheck", isSignedIn, followCheck)

module.exports = router