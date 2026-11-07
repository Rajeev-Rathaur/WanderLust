if(process.env.NODE_ENV !="production"){
require("dotenv").config();
}


const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const expresserror=require("./utils/expressError.js");

const listingRouter=require("./routes/listings.js");
const reviewRouter=require("./routes/reviews.js");
const userRouter=require("./routes/user.js");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const user=require("./models/user.js");
// const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

// const geocodingClient = mbxGeocoding({
//     accessToken: process.env.MAP_TOKEN
// });



const session=require("express-session");
const MongoStore = require('connect-mongo').default;

dburl=process.env.ATLAS_DB_URL;
console.log(dburl);

const store = MongoStore.create({
    mongoUrl:dburl,
    cryto:{
        secret:process.env.SECRET,
        touchAfter:24*3600,
    }
});

store.on("error",()=>{
    console.log("ERROR in MONGO SESSION STORE",err);
});

const sessionoptions={
    store,
    secret:process.env.SECRET,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
       },
};


async function main(){
   await mongoose.connect(dburl);
}

main()
.then(()=>{
    console.log("connection successfuly");
    app.listen(8080,()=>{
    console.log("app is listening");
})
   
})
.catch((err)=>{
    console.log(err);
    console.log("something wrong no connection");
})

// async function main(){
//    await mongoose.connect(dburl);
// }

//"mongodb://127.0.0.1:27017/wanderlust"

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))




// app.get("/",(req,res)=>{
//     res.send("HOME PAGE!");
// })


app.use(session(sessionoptions));
app.use(flash());


// authentication.......................................


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

//......................................................


app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// app.get("/demouser",async(req,res)=>{
//     let fakeuser=new user({
//         email:"student@gmail.com",
//         username:"rajeev"
//     });
//    let registereduser=await user.register(fakeuser,"helloworld");
//    res.send(registereduser);
// })

app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter);
app.use("/",userRouter);






// random route 

app.all("/*splat",(req,res,next)=>{
    next(new expresserror(404,"page not found"))
})


app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{err});
   // res.status(statuscode).send(message);
});

// app.listen(8080,()=>{
//     console.log("app is listening");
// })

