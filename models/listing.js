const mongoose=require("mongoose");
const Schema=mongoose.Schema;

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
    },
    image:{
        filename:{
            type:String,
            default:"listingimage",
        },
        url:{
            type:String,
            default:"https://unsplash.com/photos/fallow-deer-in-forest-bTs92Qni588",

        }
       
    },
    price:Number,
    location:String,
    country:String,
});

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;