import mongoose from "mongoose";

const guestSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  address: String,
  nic: String,
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  gender: String,
  password: String,
  status: { type: String, default: "Active" },
  role: { type: String, default: "User" },
});

const Guest = mongoose.model("Guest", guestSchema, "guest");

export default Guest;
