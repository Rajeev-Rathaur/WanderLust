const Listing=require("../models/listing.js");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/Geocoding');
const mapToken=process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
  //  console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
};


module.exports.renderNewForm=(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showListing=async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
         path:"author",
        }
    })
    .populate("owner");
    if(!listing){
        req.flash("error","this listing doesn't exist");
        res.redirect("/listings");
    }else{
    res.render("listings/show.ejs",{listing});
    }
};


module.exports.createListing=async(req,res,next)=>{

let response = await geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
  .send()

  console.log("reached");
  console.log("file",req.file);
  console.log("body",req.body);


let  url=req.file.path;
let filename=req.file.filename;

//   let url=req.file.path;
//   let filename=req.file.filename;
//    console.log(url,"..",filename);

 //  if(listing.image?.url=="") listing.image.url=undefined;
//  listing.image={url,filename};
  //console.log("listing data",listing);

   const newlisting=new Listing(req.body.listing);
   newlisting.owner=req.user._id;
   newlisting.image={url,filename};
   newlisting.geometry=response.body.features[0].geometry;
   await newlisting.save();
  req.flash("success","New listing created successfully!");
   res.redirect("/listings");
};

module.exports.renderEditForm=async (req,res)=>{
    let {id}=req.params;
const listing=await Listing.findById(id);
console.log(listing);
let originalImageUrl=listing.image.url;
    originalImageUrl=originalImageUrl.replace("/upload","/upload/w_250");
  if(!listing){
        req.flash("error","this listing doesn't exist");
        res.redirect("/listings");
    }else{
    res.render("listings/editform.ejs",{listing,originalImageUrl});
    }
};


module.exports.updateListing=async (req,res)=>{

    let {id}=req.params;
   // let listing= await Listing.findById(id);
   let listing= await Listing.findByIdAndUpdate(id,{...req.body.listing});
   if(typeof req.file!=="undefined") {
   let url=req.file.path;
    let filename=req.file.filename;
    listing.image={url,filename};
    let savelisting=await listing.save();
    console.log(savelisting,"printed============");
   }
    req.flash("success","Listing updated successfully!");
    res.redirect(`/listings/${id}`);
};


module.exports.destroyListing=async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted successfully!");
    res.redirect("/listings");
};