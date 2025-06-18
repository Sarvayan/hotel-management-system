import express from "express";
import { eventBooking } from "../controllers/eventBookingController.js";
import { getEventBookings } from "../controllers/eventBookingController.js";
import { checkEventAvailability } from "../controllers/eventBookingController.js";
import { getEventBookingsByGuest } from "../controllers/eventBookingController.js";
import { guestToUpdate } from "../controllers/eventBookingController.js";
import { getAEventBookings } from "../controllers/eventBookingController.js";
import { getCEventBookings } from "../controllers/eventBookingController.js";
import { getBooking } from "../controllers/eventBookingController.js";
import { deleteBooking } from "../controllers/eventBookingController.js";

const router = express.Router();

router.post("/eventbooking", eventBooking);
router.get("/geteventbookings", getEventBookings);
router.get("/getAeventbookings", getAEventBookings);
router.get("/getCeventbookings", getCEventBookings);
router.post("/checkeventavailability", checkEventAvailability);
router.get("/checkeventbookings", getEventBookingsByGuest);
router.put("/updateeventstatus/:id", guestToUpdate);
router.get("/getbooking/:id", getBooking);
router.delete("/delete/:id", deleteBooking);

export default router;
