import Checkout from "../models/checkoutModel.js";

export const createCheckout = async (req, res) => {
  try {
    const { bookingType, bookingData, guestOrders } = req.body;
    const newRecord = new Checkout({
      bookingType,
      bookingData,
      guestOrders,
      checkedOutAt: new Date(),
    });
    await newRecord.save();
    res.json({ message: "Checkout record saved successfully" });
  } catch (error) {
    res.json({ message: "Error saving checkout record", error });
  }
};
