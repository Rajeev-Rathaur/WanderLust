const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require("./models/listing.js")
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");


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

app.get("/listings/:id",async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});

// create route
app.post("/listings",async(req,res)=>{
   // let{title,description,image,price,location,country}=req.body;
   let listing=req.body.listing;
   const newlisting=new Listing(listing);
  await newlisting.save();
   //console.log(newlisting);
   res.redirect("/listings");
})

// edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let {id}=req.params;
const listing=await Listing.findById(id);
    res.render("listings/editform.ejs",{listing});
})

//update route

app.put("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//delete route

app.delete("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
})

app.listen(8080,()=>{
    console.log("app is listening");
})