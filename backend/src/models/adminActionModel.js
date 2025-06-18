import mongoose from "mongoose";

const AdminActionSchema = new mongoose.Schema({
  actionType: String,
  reason: String,
  targetId: String,
  admin: String,
  timestamp: { type: Date, default: Date.now },
});

const AdminAction = mongoose.model(
  "AdminAction",
  AdminActionSchema,
  "adminaction"
);

export default AdminAction;