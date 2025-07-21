import Order from "../models/orderModel.js";
import RoomBooking from "../models/roomBookingModel.js";
import EventBooking from "../models/eventBookingModel.js";

export const placeOrder = async (req, res) => {
  try {
    const email = req.cookies.email;

    const { orderItems, totalPrice } = req.body;

    if (!email) {
      return res.status(401).send("You must be logged in to place an order.");
    }

    const existingOrder = await Order.findOne({ email });
    console.log(existingOrder)

    if (existingOrder) {
      const updatedItems = [...existingOrder.orderItems];

      orderItems.forEach((newItem) => {
        const index = updatedItems.findIndex(
          (item) => item.name === newItem.name
        );

        if (index !== -1) {
          updatedItems[index].quantity += newItem.quantity;
        } else {
          updatedItems.push({ name: newItem.name, quantity: newItem.quantity });
        }
      });

      existingOrder.orderItems = updatedItems;
      existingOrder.totalPrice += totalPrice;

      await existingOrder.save();
      return res.send(true);
    } else {
      const newOrder = new Order({
        email,
        orderItems: orderItems.map((item) => ({
          name: item.name,
          quantity: item.quantity,
        })),
        totalPrice,
      });

      await newOrder.save();
      return res.send(true);
    }
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).send("Internal server error");
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
