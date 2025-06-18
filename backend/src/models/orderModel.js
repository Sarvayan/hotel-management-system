import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  email: { type: String, required: true },
  orderItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const Order = mongoose.model("Order", orderSchema, "order");

export default Order;
