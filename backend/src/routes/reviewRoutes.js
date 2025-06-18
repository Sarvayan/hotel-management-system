import express from "express";
import { addReview } from "../controllers/reviewController.js";
import { getReviews } from "../controllers/reviewController.js";

const router = express.Router();

router.post("/addreview", addReview);
router.get("/getreviews", getReviews);

export default router;
