import mongoose from "mongoose";

const pastBookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },
  type: { type: String, enum: ["Room", "Event"], required: true },
  removedBy: { type: String, default: "System" },
  removedDate: { type: Date, default: Date.now },
});

const PastBooking = mongoose.model(
  "PastBooking",
  pastBookingSchema,
  "past_booking"
);

export default PastBooking;
