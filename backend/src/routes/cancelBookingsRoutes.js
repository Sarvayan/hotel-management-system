import express from "express";
import { cancelBooking } from "../controllers/cancelBookingsController.js";
import { cancelBookingAdmin } from "../controllers/cancelBookingsController.js";
import { getCancelledAdmin } from "../controllers/cancelBookingsController.js";

const router = express.Router();

router.post("/cancelbooking", cancelBooking);
router.post("/cancelbookingadmin", cancelBookingAdmin);
router.get("/getcancelled", getCancelledAdmin);

export default router;
