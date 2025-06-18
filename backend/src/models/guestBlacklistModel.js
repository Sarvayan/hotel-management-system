import mongoose from "mongoose";

const guestBlacklistSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  address: String,
  nic: String,
  phoneNumber: String,
  gender: String,
  email: { type: String, required: true, unique: true },
  reason: String,
  status: { type: String, default: "Blacklisted" },
});

const guestBlacklist = mongoose.model(
  "guestBlacklist",
  guestBlacklistSchema,
  "guest_blacklist"
);

export default guestBlacklist;
