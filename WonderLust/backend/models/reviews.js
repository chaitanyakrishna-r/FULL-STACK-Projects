const mongoose = require('mongoose');
const {Schema} = mongoose;


//review schema
const reviewSchema = new Schema(
    {
        
        rating: {
            type:Number,
            max:5,
            Min:1,
        },
        comment: String,
        createdAt: {
            type:String,
            default: Date.now(),
        },
        listing: {
            type: Schema.Types.ObjectId,
            ref: "Listing"
        },
        author: {
            type:Schema.Types.ObjectId,
            ref:"User"
        }

    }
);


//model

const Review = mongoose.model("Review",reviewSchema);

module.exports = Review;

