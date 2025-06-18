import mongoose from "mongoose";

const roomBookingSchema = new mongoose.Schema({
  email: { type: String, required: true },
  checkin: Date,
  checkout: Date,
  noofrooms: Number,
  roomtype: String,
  adult: Number,
  children: Number,
  nationality: String,
  kitchen: { type: String, default: "No" },
  totalAmount: Number,
  assignedRoomNos: [String], // List of room numbers assigned
  type: { type: String, default: "Room" },
  status: { type: String, default: "Reserved" },
});

const RoomBooking = mongoose.model(
  "RoomBooking",
  roomBookingSchema,
  "room_booking"
);

export default RoomBooking;
