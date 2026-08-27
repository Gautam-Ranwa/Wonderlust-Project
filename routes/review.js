import express from "express";
const router = express.Router({ mergeParams: true });
import Review from "../models/review.js";
import Listing from "../models/listing.js";

//Post - Route

router.post("/", async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${listing._id}`);
})

// delete review Route 
router.delete("/:reviewId", async (req, res) => {
    let { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`)

});


export default router;