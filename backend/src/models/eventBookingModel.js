import mongoose from "mongoose";

const eventBookingSchema = new mongoose.Schema({
  eventDate: { type: Date, required: true },
  checkoutDate: { type: Date, required: true },
  eventType: { type: String },
  guests: { type: Number, required: true, min: 1, max: 200 },
  email: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  type: { type: String, default: "Event" },
  status: { type: String, default: "Reserved" },
});

const EventBooking = mongoose.model(
  "EventBooking",
  eventBookingSchema,
  "event_booking"
);

export default EventBooking;
