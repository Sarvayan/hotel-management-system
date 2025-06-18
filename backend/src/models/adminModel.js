import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  address: String,
  nic: String,
  email: { type: String, required: true, unique: true },
  phoneNumber: String,
  gender: String,
  password: String,
  status: { type: String, default: "Active" },
  role: { type: String, default: "Admin" },
});

const Admin = mongoose.model("Admin", adminSchema, "admin");

export default Admin;
