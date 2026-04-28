const Listing = require("../models/listing");
const Review = require("../models/reviews");

//create review
module.exports.createReview = async (req,res)=>{ 
    const {id} = req.params;
    const {username,rating,comment} = req.body;

   
    //get listing
    const listing = await Listing.findById(id);

    //create review
    const newReview = new Review(
        {
            username: username,
            rating: rating,
            comment: comment,
            
        }
    );
    //linking
    listing.reviews.push(newReview._id);

    newReview.listing = listing._id;
    newReview.author = req.user._id;
    

    //save data to db
    const result = await newReview.save();
    const listingResult = await listing.save();

    // console.log(result);
    // console.log(listingResult);

    res.redirect(`/listing/${id}`);
    
}

module.exports.editReview = async (req,res)=>{
    const {reviewId,id} = req.params;
    const review = await Review.findById(reviewId);
    // console.log("from review.js and edit",review);
    res.render("reviews/editReview",{id:id,review});
}

module.exports.updateReview = async(req,res)=>{
    const {reviewId,id} = req.params;
    const {username,comment,rating} = req.body;

    const result = await Review.findByIdAndUpdate(reviewId,{username:username,comment:comment,rating:rating} );

    res.redirect(`/listing/${id}`);

}

module.exports.destroyReview = async(req,res)=>{
    const {id,reviewId} = req.params;
    await Review.findByIdAndDelete(reviewId);

    //remove from listing
    await Listing.findByIdAndUpdate(id, {
    $pull: { reviews: reviewId }
    });
    res.redirect(`/listing/${id}`);
}