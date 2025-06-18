import express from "express";
import { addFeedback } from "../controllers/feedbackController.js";
import { getFeedbacks } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/addfeedback", addFeedback);
router.get("/getfeedbacks", getFeedbacks);

export default router;
