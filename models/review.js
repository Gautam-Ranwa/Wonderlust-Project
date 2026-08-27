import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        mac: 5,
    },
    created_at: {
        type: Date,
        default: Date.now(),
    }
});

const Review = mongoose.model("Review", reviewSchema);

export default Review;