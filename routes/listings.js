const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {isLoggedIn,isOwner,validatelisting}=require("../middleware.js");
const listingController=require("../controllers/listing.js");
const multer  = require('multer');
const {storage}=require("../cloudConfig.js");
const upload = multer({storage});

// index route and create new listing route


router.route("/")
.get(
    wrapAsync(listingController.index)
)
 .post(
    //(req,res,next)=>{
//     console.log("request reached");
//     next();
// },
    isLoggedIn("create","listing"),

// (req,res,next)=>{
//     console.log("login passed");
//     next();
// },
    upload.single("listing[image][url]"),
    validatelisting,
    wrapAsync(listingController.createListing)
// .post(upload.single("listing[image][url]"),(req,res)=>{
//     res.send(req.file);
);

// new route
router.get("/new",isLoggedIn("create","listing"),listingController.renderNewForm)


// show , update and delete route

router.route("/:id")
.get(wrapAsync(listingController.showListing))
.put(
    isLoggedIn("update","listing"),
    isOwner("update"),
    upload.single("listing[image][url]"),
    validatelisting,
    wrapAsync(listingController.updateListing))
.delete(
    isLoggedIn("delete","listing"),
    isOwner("delete"),
    wrapAsync(listingController.destroyListing));



// edit route
router.get(
    "/:id/edit",
    isLoggedIn("edit","listing"),
    isOwner("edit"),
    wrapAsync(listingController.renderEditForm));




module.exports=router;
