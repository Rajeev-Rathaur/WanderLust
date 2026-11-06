const User=require("../models/user.js");





module.exports.signupUserForm=(req,res)=>{
  res.render("users/signup.ejs");
};

module.exports.loginUserForm=(req,res)=>{
    res.render("users/login.ejs");
};



module.exports.signupUser=async(req,res)=>{
    try{
    let{username,email,Password} =req.body;
    let newUser=new User({email,username});
    let registereduser= await User.register(newUser,Password);
    console.log(registereduser);
    req.login(registereduser,(err)=>{
        if(err){
            return next();
        }
         req.flash("success","registered successfully");
          res.redirect("/listings");
    })
    }
    catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
};


module.exports.loginUser=async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust!")
    let redirectUrl=res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;

    if(redirectUrl.includes("?_method=DELETE")){
        redirectUrl=redirectUrl.split("?")[0].split("/reviews/")[0];
    }
    res.redirect(redirectUrl);
};


module.exports.logoutUser=(req,res,next)=>{
    req.logout(err=>{
        if(err){
            return next(err);
        }
        req.flash("success","you are logged out");
        res.redirect("/listings");
    })

};