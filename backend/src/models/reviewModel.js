import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  email: { type: String, required: true },
  name: String,
  address: String,
  star: Number,
  type: String,
  comment: String,
  reviewDate: {
    type: Date,
    
    expires: 60 * 60 * 24 * 30,
  },
});

const Review = mongoose.model("Review", reviewSchema, "review");

export default Review;
