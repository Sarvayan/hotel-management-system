import Review from "../models/reviewModel.js";

export const addReview = async (req, res) => {
  try {
    // Get email from cookie for authentication check
    const email = req.cookies.email;

    if (!email) {
      return res.status(401).send("Unauthorized access");
    }

    // Destructure data from request body
    const { name, address, star, type, comment, reviewDate } = req.body;

    // Create a new review document
    const newReview = new Review({
      email,
      name,
      address,
      star,
      type,
      comment,
      reviewDate: reviewDate || new Date(), // fallback if not sent
    });

    // Save the review to the database
    await newReview.save();

    console.log("Review Added To The Database Successfully");
    res.send(true);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ error: "Failed to add review" });
  }
};

export const getReviews = async (req, res) => {
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
