import express from "express";

import { sendSMS } from "../controllers/notificationController.js";

const router = express.Router();

router.post("/send-sms", sendSMS);

export default router;
