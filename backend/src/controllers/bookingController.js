import RoomBooking from "../models/roomBookingModel.js";
import EventBooking from "../models/eventBookingModel.js";
import PastBooking from "../models/pastBookingModel.js";

export const removeExpiredBookings = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const expiredRoomBookings = await RoomBooking.find({
      status: "Accepted",
      checkout: { $lt: today },
    });

    for (const booking of expiredRoomBookings) {
      await PastBooking.create({
        email: booking.email,
        checkin: booking.checkin,
        checkout: booking.checkout,
        type: "Room",
        removedBy: "System",
        removedDate: new Date(),
      });
      await RoomBooking.deleteOne({ _id: booking._id });
    }

    const expiredEventBookings = await EventBooking.find({
      status: "Accepted",
      checkout: { $lt: today },
    });

    for (const booking of expiredEventBookings) {
      await PastBooking.create({
        email: booking.email,
        checkin: booking.checkin,
        checkout: booking.checkout,
        type: "Event",
        removedBy: "System",
        removedDate: new Date(),
      });
      await EventBooking.deleteOne({ _id: booking._id });
    }

    console.log("Expired bookings removed and archived.");
  } catch (err) {
    console.error("Error in removeExpiredBookings:", err);
  }
};
