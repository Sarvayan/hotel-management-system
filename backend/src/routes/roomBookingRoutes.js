import express from "express";
import { roomBooking } from "../controllers/roomBookingController.js";
import { getRoomBookings } from "../controllers/roomBookingController.js";
import { getRoomBookingsByGuest } from "../controllers/roomBookingController.js";
import { guestToUpdate } from "../controllers/roomBookingController.js";
import { checkRoomAvailability } from "../controllers/roomBookingController.js";
import { getARoomBookings } from "../controllers/roomBookingController.js";
import { getCRoomBookings } from "../controllers/roomBookingController.js";
import { getBooking } from "../controllers/roomBookingController.js";
import { deleteBooking } from "../controllers/roomBookingController.js";

const router = express.Router();

router.post("/roombooking", roomBooking);
router.get("/getroombookings", getRoomBookings);
router.get("/getAroombookings", getARoomBookings);
router.get("/getCroombookings", getCRoomBookings);
router.get("/checkroombookings", getRoomBookingsByGuest);
router.put("/updateroomstatus/:id", guestToUpdate);
router.post("/checkroomavailability", checkRoomAvailability);
router.get("/getbooking/:id", getBooking);
router.delete("/delete/:id", deleteBooking);

export default router;
