const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require('../utils/wrapAsync');
const { validateReviews,isReviewLoggedIn,isReviewOwner } = require('../utils/middleware.js');
const reviewController = require("../controllers/reviews.js");

// router.get("/listing/:id/reviews",async (req,res)=>{
//     const {id} = req.params;
//     const reviews = await Review.find();
//     res.render("reviews/reviews",{id,reviews});
// })


//creat new review
router.post("/",isReviewLoggedIn,validateReviews,wrapAsync(reviewController.createReview));


//edit 
router.get('/:reviewId/edit',isReviewLoggedIn,reviewController.editReview)

//update and delete
router.route("/:reviewId")
    .patch(isReviewLoggedIn,isReviewOwner,reviewController.updateReview)
    .delete(isReviewLoggedIn,isReviewOwner,wrapAsync(reviewController.destroyReview));


module.exports = router;


