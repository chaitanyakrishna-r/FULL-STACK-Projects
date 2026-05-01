const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review= require("./reviews");


//schema
const listingSchema = new Schema({
 
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    filename: {
      type: String,
      default: "listingimage"
    },
    url: {
        type:String,
        default:"https://unsplash.com/photos/three-brown-wooden-boat-on-blue-lake-water-taken-at-daytime-T7K4aEPoGGk",
        set: (v) => v === ""? "https://unsplash.com/photos/a-person-standing-on-top-of-a-large-rock-eOWabmCNEdg" : v,
    },
  },
  price: Number,
  location: String,
  country: String,
   reviews: [{
      type:Schema.Types.ObjectId,
      ref: "Review"
  }],
  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },
   geometry:{
    type:{
      type: String,
      enum: ['Point'],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    }
  },
  category:{
    type:String,
    enum:["Beach","Mountain","Cabins","Amazing Pool","Iconic Cities","Farms","Lakefront","Arctic"],
  }

});

//middleware 

listingSchema.post('findOneAndDelete',async (listing)=>{
  console.log("🔥 middleware triggered");
    console.log("listing:", listing);
    if(listing && listing.reviews.length > 0){
        let result = await Review.deleteMany(
          {_id: {$in: listing.reviews}}    
        );
        console.log("deleted all review inside list")
        console.log(result);
    }
})

//model
const Listing = mongoose.model("Listing", listingSchema);

// export model

module.exports = Listing;
