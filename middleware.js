const Listing=require("./models/listing.js");
const Review=require("./models/reviews.js");
const expresserror=require("./utils/expressError.js");
const {listingschema,reviewschema}=require("./joischema.js");



module.exports.isLoggedIn=(action,resource)=>{
   return (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        req.flash("error",`you must be logged in to ${action} ${resource}`);
        return res.redirect("/login");
    }
    next();

};
};

module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
};

module.exports.isOwner=(action)=>{
    return async(req,res,next)=>{
     let {id}=req.params;
    let listing= await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error",`you are not permitted to ${action} this listing`);
       return  res.redirect(`/listings/${id}`);
    }
    next();
};
        };


module.exports.isReviewAuthor=(action)=>{
    return async(req,res,next)=>{
     let {id,reviewId}=req.params;
    let review= await Review.findById(reviewId);
    if(!review.author._id.equals(res.locals.currUser._id)){
        req.flash("error",`you are not permitted to ${action} this review`);
       return  res.redirect(`/listings/${id}`);
    }
    next();
};
        };


module.exports.validatelisting=(req,res,next)=>{
        let {error}=listingschema.validate(req.body);
        
        if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new expresserror(400,errmsg);
        }
        else next();
        }



module.exports.validateReview=(req,res,next)=>{
  
     let {error}=reviewschema.validate(req.body);

   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new expresserror(400,errmsg);
   }
   else next();
}