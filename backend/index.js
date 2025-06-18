import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "./src/cronJob.js";
import connectDB from "./src/config/db.js";
import guestRoutes from "./src/routes/guestRoutes.js";
import adminRoutes from "./src/routes/adminRoutes.js";
import roomBookingRoutes from "./src/routes/roomBookingRoutes.js";
import eventBookingRoutes from "./src/routes/eventBookingRoutes.js";
import foodTypeRoutes from "./src/routes/foodTypeRoutes.js";
import menuRoutes from "./src/routes/menuRoutes.js";
import orderRoutes from "./src/routes/orderRoutes.js";
import reviewRoutes from "./src/routes/reviewRoutes.js";
import feedbackRoutes from "./src/routes/feedbackRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import eventRoutes from "./src/routes/eventRoutes.js";
import inventoryRoutes from "./src/routes/inventoryRoutes.js";
import guestBlacklistRoutes from "./src/routes/guestBlacklistRoutes.js";
import cancelBookingsRoutes from "./src/routes/cancelBookingsRoutes.js";
import adminActionRoutes from "./src/routes/adminActionRoutes.js";
import aiRoutes from "./src/routes/aiRoutes.js";
import Checkout from "./src/routes/checkoutRoutes.js";
import NotificationRoutes from "./src/routes/notificationRoutes.js";

import dotenv from "dotenv";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

connectDB();

app.use("/api/guests", guestRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/roombookings", roomBookingRoutes);
app.use("/api/eventbookings", eventBookingRoutes);
app.use("/api/foodtype", foodTypeRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/order", orderRoutes);
app.use("/api/review", reviewRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/guestblacklist", guestBlacklistRoutes);
app.use("/api/cancelbookings", cancelBookingsRoutes);
app.use("/api/admin", adminActionRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/checkout", Checkout);
app.use("/api/notification", NotificationRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
