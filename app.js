const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const wrapAsync=require("./utils/wrapAsync.js");
const expresserror=require("./utils/expressError.js");
const {listingschema}=require("./joischema.js");
const { resourceLimits } = require("worker_threads");


main()
.then(()=>{
    console.log("connection successfuly");
})
.catch((err)=>{
    console.log(err);
    console.log("something wrong no connection");
})

async function main(){
   await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")))


app.get("/",(req,res)=>{
    res.send("HOME PAGE!");
})

// app.get("/testlisting",async(req,res)=>{
//     let samplelisting=new Listing({
//         title:"My new villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calangute, Goa",
//         country:"India"
//     });
//     await samplelisting.save();
//     console.log("saple was saved");
//     res.send("testing successfully");
// });


// server side validation using joi  and middleware

const validatelisting=(req,res,next)=>{
     let {error}=listingschema.validate(req.body);

   if(error){
    let errmsg=error.details.map((el)=>el.message).join(",");
    throw new expresserror(400,errmsg);
   }
   else next();
}


// index route
app.get("/listings",async (req,res)=>{
    const allListings=await Listing.find({});
  //  console.log(allListings);
    res.render("./listings/index.ejs",{allListings});
});


// new route
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs")
})


// show route

app.get("/listings/:id",wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
}));

// create new listing route
app.post("/listings",validatelisting,
    wrapAsync(async(req,res,next)=>{
   // let{title,description,image,price,location,country}=req.body;
//    if(!req.body.listing){
//     throw new expresserror(400,"Send a valid data for listing");
//    }

   let listing=req.body.listing;
//    let result=listingschema.validate(req.body);
//    console.log(result);
//    if(result.error){
//     throw new expresserror(400,result.error);
//    }
  //  res.send("hii");
//    if(){
//     throw new expresserror(400,"result");
   

//    if(!listing.title){
//     throw new expresserror(400,"title is missing");
//    }
//     if(!listing.location){
//     throw new expresserror(400,"location is missing");
//    }
//    if(listing.image?.url=="") listing.image.url=undefined;
  // console.log(listing);

   const newlisting=new Listing(listing);
  await newlisting.save();
   //console.log(newlisting);
   res.redirect("/listings");
})
);

// edit route
app.get("/listings/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
const listing=await Listing.findById(id);
console.log(listing);
    res.render("listings/editform.ejs",{listing});
}))

//update route

app.put("/listings/:id",validatelisting,wrapAsync(async (req,res)=>{
    let {id}=req.params;
//     if(!req.body.listing){
//     throw new expresserror(400,"Send a valid data for listing");
//    }
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}))

//delete route

app.delete("/listings/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))


// random route 

app.all("/*splat",(req,res,next)=>{
    next(new expresserror(404,"page not found"))
})


app.use((err,req,res,next)=>{
    let {statuscode=500,message="Something went wrong"}=err;
    res.status(statuscode).render("error.ejs",{err});
   // res.status(statuscode).send(message);
});

app.listen(8080,()=>{
    console.log("app is listening");
})