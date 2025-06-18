import Order from "../models/orderModel.js";
import RoomBooking from "../models/roomBookingModel.js";
import EventBooking from "../models/eventBookingModel.js";

export const placeOrder = async (req, res) => {
  try {
    const email = req.cookies.email;

    const { orderItems, totalPrice } = req.body;

    /* if (!email) {
      return res.send("You have to first signup/login first");
    } */

    const newOrder = new Order({
      email,
      orderItems: orderItems.map((item) => ({
        name: item.name,
        quantity: item.quantity,
      })),
      totalPrice,
    });

    await newOrder.save();
    res.send(true);
  } catch (error) {
    console.error("Error placing order:", error);
    res.send("Internal server error");
  }
};

export const checkGuest = async (req, res) => {
  try {
    const email = req.cookies.email;
    console.log(email);

    if (!email) {
      return res.send("Unauthorized access");
    }

    const existingRoomBooking = await RoomBooking.findOne({ email: email });
    const existingEventBooking = await EventBooking.findOne({ email: email });

    if (
      (existingRoomBooking && existingRoomBooking.status === "CheckedIn") ||
      (existingEventBooking && existingEventBooking.status === "CheckedIn")
    ) {
      console.log("yes got");
      return res.send(true);
    }

    console.log("no got");
    return res.send(false);
  } catch (error) {
    console.error("Error during checking guest:", error);
    res.send("Checking guest failed");
  }
};

export const getOrder = async (req, res) => {
  const { email } = req.cookies;
  console.log(email);
  console.log(email);

  try {
    const orders = await Order.find({ email: email });
    console.log("win");

    if (orders.length === 0) {
      console.log("No orders found");
      return res.json([]);
    }

    res.json(orders);
    console.log("yes there");
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.json({ message: "Internal Server Error" });
  }
};

export const getOrders = async (req, res) => {
  const { email } = req.cookies;
  console.log(email);

  try {
    const orders = await Order.find();

    if (orders.length === 0) {
      console.log("No orders found");
      return res.json([]);
    }

    res.json(orders);
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteOrderByEmail = async (req, res) => {
  const { email } = req.params;

  try {
    const result = await Order.deleteMany({ email });

    if (result.deletedCount === 0) {
      return res.json({ message: "No orders found for this email" });
    }

    res.json({ message: "Orders deleted successfully" });
  } catch (err) {
    console.error("Error deleting orders:", err);
    res.json({ message: "Internal Server Error" });
  }
};
