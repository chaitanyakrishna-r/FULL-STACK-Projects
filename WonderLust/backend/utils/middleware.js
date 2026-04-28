// middleware.js
const { listingSchema, reviewSchema } = require('../schema.js');
const ExpressError = require('./ExpressError.js');
const Listing = require("../models/listing");
const Review = require("../models/reviews.js");


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

const validateReviews = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports = { validateListing, validateReviews };


module.exports.isLoggedIn = (req,res,next)=>{
        if(!req.isAuthenticated()){
            //store redirect url
            req.session.redirectUrl = req.originalUrl;

            // // for reviews 
            // const urlArr = req.session.redirectUrl.split("/");
            // const lastPart = urlArr[urlArr.length - 1]; 
            // if(lastPart === "reviews"){
            //     urlArr.pop();
            //    req.session.redirectUrl = urlArr.join('/');
            // }
           
            req.flash("error","user must be logged in");
           return res.redirect("/login");
        }
        next();
}


//review
module.exports.isReviewLoggedIn = (req,res,next)=>{
        const {id} = req.params;
        if(!req.isAuthenticated()){
            //store redirect url
            // console.log(`/listing/${id}`);
            req.session.redirectUrl = `/listing/${id}`;
            
            req.flash("error","user must be logged in");
            
           return res.redirect("/login");
        }
        next();
}

 // only update by onwer
    module.exports.isReviewOwner = async(req,res,next)=>{
        const {reviewId,id} = req.params;
        const review = await Review.findById(reviewId);
        if(!res.locals.currentUser._id.equals(review.author._id)){
            req.flash("error","You Dont have access to change the reviews");
            return res.redirect(`/listing/${id}`)
        }
        next();
    }


module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    } 
    next();
}

module.exports.isOwner = async(req,res,next)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    if(!res.locals.currentUser._id.equals(listing.owner._id)){
        req.flash("error","You are not the owner of this Listing");
        return res.redirect(`/listing/${id}`);
    }
    next();
}

