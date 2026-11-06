const mongoose=require("mongoose");
const initdata=require("./data.js");
const Listing=require("../models/listing.js");


const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";


main()
.then(()=>{
    console.log("connection successful");
})
.catch((err)=>{
    console.log(err);
    console.log("something is wrong");
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

const initDB=async()=>{
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner:"6adb5a6f8bd42549c74cf849"}));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
};

initDB();