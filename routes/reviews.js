const express=require("express");
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const expresserror=require("../utils/expressError.js");
const Review=require("../models/reviews.js");
const Listing=require("../models/listing.js");
const {reviewschema}=require("../joischema.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");
const reviewController=require("../controllers/reviews.js");



//post reviews route 

router.post("/",
    isLoggedIn("post","reviews"),
    validateReview,
    wrapAsync(reviewController.postreview));

// delete Review route

router.delete("/:reviewId",
    isLoggedIn("delete","reviews"),
    isReviewAuthor("delete"),
    wrapAsync(reviewController.deletereview));

module.exports=router;