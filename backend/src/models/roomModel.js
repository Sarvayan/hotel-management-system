import mongoose from "mongoose";

const roomSchema = new mongoose.Schema({
  roomNo: String,
  roomType: String,
  pricePerNight: Number,
  availabilityStatus: String,
  cleaningStatus: String,
  
});

const Room = mongoose.model("Room", roomSchema, "room");

export default Room;
