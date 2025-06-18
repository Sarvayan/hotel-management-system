import Feedback from "../models/feedbackModel.js";

export const addFeedback = async (req, res) => {

  try {
   
    const email1 = req.cookies.email;
    if (!email1) {
      return res.send("Unauthorized access");
    }

     

    const { fname, lname, email, feedbacktype, comment } = req.body;

    const newFeedback = new Feedback({
      fname,
      lname,
      email,
      feedbacktype,
      comment,
    });

    await newFeedback.save();
    console.log("Feedback added to the database successfully");
    res.send(true);
  } catch (error) {
    console.error("Error adding feedback:", error);
    res.send(false);
  }
};

export const getFeedbacks = async (req, res) => {
  try {
    const reviews = await Review.find();

    if (reviews.length === 0) {
      return res.send("No reviews found");
    }

    res.status(200).json({ success: true, reviews });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.send("Failed to fetch reviews");
  }
};
