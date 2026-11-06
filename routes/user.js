const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const passport=require("passport");
const {saveRedirectUrl}=require("../middleware.js");
const userController=require("../controllers/user.js");

// sign up form and signup

router.route("/signup")
.get(userController.signupUserForm)
.post(userController.signupUser);


//login form and login 

router.route("/login")
.get(userController.loginUserForm)
.post(
    saveRedirectUrl,
    passport.authenticate("local",{
    failureRedirect:"/login",
    failureFlash:true
}),userController.loginUser)



// logout 

router.get("/logout",userController.logoutUser)

module.exports=router;

