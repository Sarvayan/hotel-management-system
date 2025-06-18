import mongoose from "mongoose";
import CancelBookings from "../models/cancelBookingsModel.js";
import RoomBooking from "../models/roomBookingModel.js";
import EventBooking from "../models/eventBookingModel.js";

export const cancelBooking = async (req, res) => {
  try {
    const email = req.cookies.email;
    console.log("User Email:", email);

    if (!email) {
      return res.status(401).send("Unauthorized access");
    }

    console.log("joki");

    const { type, bookingid, reason } = req.body;

    console.log("palai");

    if (type === "Room") {
      console.log("donlee");
      await RoomBooking.findByIdAndDelete(bookingid);
      console.log("Room booking deleted.");
    } else if (type === "Event") {
      await EventBooking.findByIdAndDelete(bookingid);
      console.log("Event booking deleted.");
    } else {
      console.log("donglee");
      return res.status(400).send("Invalid booking type");
    }

    const newcancelBooking = new CancelBookings({
      email,
      type,
      bookingid,
      reason,
      doneby: "User",
    });

    await newcancelBooking.save();
    console.log("Booking cancellation recorded successfully.");

    res.send(true);
  } catch (error) {
    console.error("Error during cancelling the booking:", error);
    res.status(500).send("Booking cancelling failed");
  }
};

export const cancelBookingAdmin = async (req, res) => {
  try {
    console.log("joki");

    const { email, type, bookingid, reason } = req.body;
    console.log(email);
    console.log("palai");

    if (type === "Room") {
      console.log("donlee");
      await RoomBooking.findByIdAndDelete(bookingid);
      console.log("Room booking deleted.");
    } else if (type === "Event") {
      await EventBooking.findByIdAndDelete(bookingid);
      console.log("Event booking deleted.");
    } else {
      console.log("donglee");
      return res.status(400).send("Invalid booking type");
    }

    // Save cancel log
    const newcancelBooking = new CancelBookings({
      email,
      type,
      bookingid,
      reason,
      doneby: "Admin",
    });

    await newcancelBooking.save();
    console.log("Booking cancellation recorded successfully.");

    res.send(true);
  } catch (error) {
    console.error("Error during cancelling the booking:", error);
    res.status(500).send("Booking cancelling failed");
  }
};

export const getCancelledAdmin = async (req, res) => {
  try {
    const cancelbookings = await CancelBookings.find({ doneby: "Admin" });

    if (cancelbookings.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No canceled bookings found" });
    }

    res.json({ success: true, cancelbookings });
  } catch (error) {
    console.error("Error retrieving cancelled bookings by admin:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
