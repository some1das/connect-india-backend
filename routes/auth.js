const { usersignup, usersignin } = require("../controllers/auth");

const express = require("express");
const { checkData } = require("./validator");
const router = express.Router();
// ---------user auth routes are here----------------
router.post("/user/signup", checkData,usersignup);
router.post("/user/signin", usersignin);

module.exports=router
