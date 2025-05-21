const express= require("express");
const router= express.Router();
const mongoose= require("mongoose");
const User= require("../models/user")
const wrapAsync= require("../utils/wrapasync");
const passport = require("passport");
const { saveredirecturl } = require("../middleware");
const usercontroller=require("../controller/user")

router.get("/signup",usercontroller.rendersignup)
router.post("/signup",wrapAsync(usercontroller.signupuser));


router.get("/login",usercontroller.renderlogin);


router.post("/login",
    saveredirecturl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true,
    }),
  usercontroller.login
);


router.get("/logout",usercontroller.logout
)

module.exports=router; 