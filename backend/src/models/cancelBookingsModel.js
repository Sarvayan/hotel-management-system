import mongoose from "mongoose";

const cancelBookingsSchema = new mongoose.Schema({
  email: { type: String, required: true },
  type: { type: String },
  bookingid: { type: mongoose.Schema.Types.ObjectId },
  reason: String,
  status: { type: String, default: "Cancelled" },
  doneby: { type: String },
});

const CancelBookings = mongoose.model(
  "CancelBookings",
  cancelBookingsSchema,
  "cancelbookings"
);

export default CancelBookings;
