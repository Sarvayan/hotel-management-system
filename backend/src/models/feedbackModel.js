import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  feedbacktype: String,
  comment: String,
});

const Feedback = mongoose.model("Feedback", feedbackSchema, "feedback");

export default Feedback;
