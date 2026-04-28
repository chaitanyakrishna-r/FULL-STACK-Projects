const mongoose = require('mongoose');
const Listing = require('../models/listing');
const initData = require('./data.js');


const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

main()
.then(()=>{
    console.log("db is connected successfully");
})
.catch((err)=> console.log(err));

//connect the mongo database 
 async function main(){
     await mongoose.connect(MONGO_URL);
};


const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((obj)=>({...obj,owner:"69d13ac69331ddaccc01b3ed"}));
   await Listing.insertMany(initData.data);
   console.log("data was initialized");
}

initDB();