import express from "express";
const router = express.Router({ mergeParams: true });
import Review from "../models/review.js";
import Listing from "../models/listing.js";
import isLoggedIn, { isReviewAuthor } from "../middleware.js";

//Post - Route

router.post("/", isLoggedIn, async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
})


// delete review Route 
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)

});


export default router;