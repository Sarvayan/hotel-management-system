import AdminAction from "../models/AdminActionModel.js";

export const logAction = async (req, res) => {
  try {
    const { actionType, reason, targetId, admin } = req.body;
    await AdminAction.create({ actionType, reason, targetId, admin });
    res.status(201).json({ success: true, message: "Action logged" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error logging action" });
  }
};
