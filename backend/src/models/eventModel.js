import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  eventNo: String,
  eventType: String,
  capacity: Number,
  cost: Number,
  description: String,
});

const Room = mongoose.model("Event", eventSchema, "event");

export default Room;
