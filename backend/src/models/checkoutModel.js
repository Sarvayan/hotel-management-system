import mongoose from "mongoose";

const checkoutSchema = new mongoose.Schema({
  bookingType: { type: String, required: true }, // "Room" or "Event"
  bookingData: { type: Object, required: true },
  guestOrders: { type: Array, required: true },
  checkedOutAt: { type: Date, default: Date.now },
});

const Checkout = mongoose.model("Checkout", checkoutSchema, "checkout");

export default Checkout;
