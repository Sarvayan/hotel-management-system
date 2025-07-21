import Guest from "../models/guestModel.js";
import RoomBooking from "../models/roomBookingModel.js";
import Room from "../models/roomModel.js";

export const checkRoomAvailability = async (req, res) => {
  try {
    console.log("reaches");

    const { checkin, checkout } = req.body;

    console.log("Room Check-in Date:", checkin);
    console.log("Room Checkout Date:", checkout);

    if (!checkin || !checkout) {
      console.log("Missing checkin or checkout date");
      return res.status(400).json({
        success: false,
        message: "Please provide both checkin date and checkout date.",
      });
    }

    const roomStart = new Date(checkin);
    roomStart.setHours(0, 0, 0, 0);
    console.log("roomStart:", roomStart);

    const roomEnd = new Date(checkout);
    roomEnd.setHours(0, 0, 0, 0);
    console.log("roomEnd:", roomEnd);

    const reservedRooms = await RoomBooking.find({
      status: "Reserved",
      type: "Room",
    });

    for (let reservedRoom of reservedRooms) {
      const existingRoomStart = new Date(reservedRoom.checkin);
      existingRoomStart.setHours(0, 0, 0, 0);
      console.log("existingRoomStart:", existingRoomStart);

      const existingRoomEnd = new Date(reservedRoom.checkout);
      existingRoomEnd.setHours(0, 0, 0, 0);
      console.log("existingRoomEnd:", existingRoomEnd);

      if (
        (roomStart >= existingRoomStart && roomStart < existingRoomEnd) ||
        (roomEnd > existingRoomStart && roomEnd <= existingRoomEnd) ||
        (roomStart <= existingRoomStart && roomEnd >= existingRoomEnd)
      ) {
        console.log("Room booking conflict detected");
        return res.json({
          success: false,
          message:
            "There is a booking conflict, the room/s is/are not available.",
        });
      }
    }

    return res.json({
      success: true,
      message: "The room is available for the selected dates.",
    });
  } catch (error) {
    console.error("Error fetching room bookings data:", error);
    return res.json({
      success: false,
      message: "Error fetching room bookings data.",
    });
  }
};

export const roomBooking = async (req, res) => {
  try {
    const email = req.cookies.email;
    console.log(email);

    if (!email) {
      return res.json({ success: false, message: "Unauthorized access" });
    }

    const {
      checkin,
      checkout,
      noofrooms,
      roomType,
      adult,
      children,
      nationality,
      kitchen,
      totalAmount,
      assignedRoomNos,
    } = req.body;

    /* const normalizedCheckin = new Date(checkin);
    normalizedCheckin.setHours(0, 0, 0, 0);

    const normalizedCheckout = new Date(checkout);
    normalizedCheckout.setHours(0, 0, 0, 0); */

    const availableRooms = await Room.find({
      roomType,
      availabilityStatus: "Available",
    });
    if (availableRooms.length < noofrooms) {
      return res.json({
        success: false,
        message: "Not enough available rooms for the selected type",
      });
    }

    const assignedRooms = availableRooms.filter((room) =>
      assignedRoomNos.includes(room.roomNo)
    );
    if (assignedRooms.length !== noofrooms) {
      return res.json({
        success: false,
        message: "Some rooms are not available",
      });
    }

    const newBooking = new RoomBooking({
      email,
      checkin,
      checkout,
      noofrooms,
      roomtype: roomType,
      adult,
      children,
      nationality,
      kitchen: noofrooms >= 3 ? "Yes" : "No",
      totalAmount,
      assignedRoomNos,
      type: "Room",
      status: "Reserved",
    });

    await newBooking.save();
    console.log("Room Booking Completed successfully");

    res.json({ success: true, message: "Room booking successful" });
  } catch (error) {
    console.error("Error during booking:", error);
    res.json({ success: false, message: "Booking failed" });
  }
};

export const getRoomBookings = async (req, res) => {
  try {
    const allGuests = await Guest.find();

    if (allGuests) {
      console.log("false");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const roomBookings = await RoomBooking.find({
      status: "Reserved",
      type: "Room",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await RoomBooking.countDocuments({
      status: "Reserved",
      type: "Room",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: allGuests,
      retdata: roomBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching room bookings data:", error);
    res.json({
      success: false,
      message: "Error fetching room bookings data",
    });
  }
};

export const getARoomBookings = async (req, res) => {
  try {
    const allGuests = await Guest.find();

    if (allGuests) {
      console.log("false");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const roomBookings = await RoomBooking.find({
      status: "Accepted",
      type: "Room",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await RoomBooking.countDocuments({
      status: "Accepted",
      type: "Room",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: allGuests,
      retdata: roomBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching room bookings data:", error);
    res.json({
      success: false,
      message: "Error fetching room bookings data",
    });
  }
};

export const getCRoomBookings = async (req, res) => {
  try {
    const allGuests = await Guest.find();

    if (allGuests) {
      console.log("false");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const roomBookings = await RoomBooking.find({
      status: "CheckedIn",
      type: "Room",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await RoomBooking.countDocuments({
      status: "CheckedIn",
      type: "Room",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: allGuests,
      retdata: roomBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching room bookings data:", error);
    res.json({
      success: false,
      message: "Error fetching room bookings data",
    });
  }
};

export const getRoomBookingsByGuest = async (req, res) => {
  try {
    const email = req.cookies.email;
    if (!email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const roomBookings = await RoomBooking.find({
      email: email,
      type: "Room",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await RoomBooking.countDocuments({
      email: email,
      type: "Room",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      retdata: roomBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching room bookings:", error);
    res.json({ success: false, message: "Error fetching room bookings" });
  }
};

export const guestToUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await RoomBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (result) {
      console.log("Booking status update successful");
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res.send(false);
  }
};

export const getBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);
    if (!booking) {
      return res.json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    res.json({ message: "Error fetching booking", error });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await RoomBooking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    await Room.updateMany(
      { roomNo: { $in: booking.assignedRoomNos } },
      { $set: { cleaningStatus: "Not Cleaned" } }
    );

    await RoomBooking.findByIdAndDelete(req.params.id);

    res.json({ message: "Booking deleted and room statuses updated" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting booking", error });
  }
};
