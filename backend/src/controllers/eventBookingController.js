import Guest from "../models/guestModel.js";
import RoomBooking from "../models/roomBookingModel.js";
import EventBooking from "../models/eventBookingModel.js";

export const eventBooking = async (req, res) => {
  try {
    console.log("hi");
    const email = req.cookies.email;
    console.log(email);
    if (!email) {
      return res.send("Unauthorized access");
    }

    /* const existingEventBooking = await EventBooking.findOne({ email: email });
    const existingRoomBooking = await RoomBooking.findOne({ email: email });

    if (!existingEventBooking || !existingRoomBooking) {
      return res.send(false);
    } */

    const { eventDate, checkoutDate, eventType, guests, totalAmount } =
      req.body;
    const normalizedEventDate = new Date(eventDate);
    normalizedEventDate.setHours(0, 0, 0, 0);

    const normalizedCheckoutDate = new Date(checkoutDate);
    normalizedCheckoutDate.setHours(0, 0, 0, 0);

    const newBooking = new EventBooking({
      eventDate: normalizedEventDate,
      checkoutDate: normalizedCheckoutDate,
      eventType,
      guests,
      email,
      totalAmount,
    });

    await newBooking.save();
    console.log("Event booked successfully");

    res.send(true);
  } catch (error) {
    console.error("Error during event booking:", error);
    res.send("Booking failed");
  }
};

export const checkEventAvailability = async (req, res) => {
  try {
    console.log("reaches");
    const { eventDate, checkoutDate } = req.body;

    console.log("Event Date:", eventDate);
    console.log("Checkout Date:", checkoutDate);

    if (!eventDate || !checkoutDate) {
      console.log("Missing eventDate or checkoutDate");
      return res.status(400).json({
        success: false,
        message: "Please provide both event date and checkout date.",
      });
    }

    // Strip the time part of the dates by setting the time to midnight
    const eventStart = new Date(eventDate);
    eventStart.setHours(0, 0, 0, 0); // Reset to midnight
    console.log("eventStart:", eventStart);

    const eventEnd = new Date(checkoutDate);
    eventEnd.setHours(0, 0, 0, 0); // Reset to midnight
    console.log("eventEnd:", eventEnd);

    const acceptedEvents = await EventBooking.find({
      status: "Accepted",
      type: "Event",
    });

    for (let event of acceptedEvents) {
      const existingEventStart = new Date(event.eventDate);
      existingEventStart.setHours(0, 0, 0, 0); // Reset to midnight
      console.log("existingEventStart:", existingEventStart);

      const existingEventEnd = new Date(event.checkoutDate);
      existingEventEnd.setHours(0, 0, 0, 0); // Reset to midnight
      console.log("existingEventEnd:", existingEventEnd);

      // Check for date conflicts, ignoring the time component
      if (
        (eventStart >= existingEventStart && eventStart < existingEventEnd) ||
        (eventEnd > existingEventStart && eventEnd <= existingEventEnd) ||
        (eventStart <= existingEventStart && eventEnd >= existingEventEnd)
      ) {
        console.log("Booking conflict detected");
        return res.json({
          success: false,
          message: "There is a booking conflict, the hall is not available.",
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: "The hall is available for the selected dates.",
    });
  } catch (error) {
    console.error("Error fetching event bookings data:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching event bookings data.",
    });
  }
};

export const getEventBookings = async (req, res) => {
  try {
    const allGuests = await Guest.find();

    if (allGuests) {
      console.log("false");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const eventBookings = await EventBooking.find({
      status: "Reserved",
      type: "Event",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await EventBooking.countDocuments({
      status: "Reserved",
      type: "Event",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: allGuests,
      retdata: eventBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching event bookings data:", error);
    res.json({
      success: false,
      message: "Error fetching event bookings data",
    });
  }
};

export const getAEventBookings = async (req, res) => {
  try {
    const allGuests = await Guest.find();

    if (allGuests) {
      console.log("false");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const eventBookings = await EventBooking.find({
      status: "Accepted",
      type: "Event",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await EventBooking.countDocuments({
      status: "Accepted",
      type: "Event",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: allGuests,
      retdata: eventBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching event bookings data:", error);
    res.json({
      success: false,
      message: "Error fetching event bookings data",
    });
  }
};

export const getCEventBookings = async (req, res) => {
  try {
    const allGuests = await Guest.find();

    if (allGuests) {
      console.log("false");
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const eventBookings = await EventBooking.find({
      status: "CheckedIn",
      type: "Event",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await EventBooking.countDocuments({
      status: "CheckedIn",
      type: "Event",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      data: allGuests,
      retdata: eventBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching event bookings data:", error);
    res.json({
      success: false,
      message: "Error fetching event bookings data",
    });
  }
};

export const getEventBookingsByGuest = async (req, res) => {
  try {
    const email = req.cookies.email;

    if (!email) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const eventBookings = await EventBooking.find({
      email: email,
      type: "Event",
    })
      .skip(skip)
      .limit(limit);

    const totalBookings = await EventBooking.countDocuments({
      email: email,
      type: "Event",
    });

    const totalPages = Math.ceil(totalBookings / limit);

    res.json({
      success: true,
      retdata: eventBookings,
      totalPages: totalPages,
    });
  } catch (error) {
    console.error("Error fetching event bookings:", error);
    res.json({ success: false, message: "Error fetching event bookings" });
  }
};

export const guestToUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const result = await EventBooking.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (result) {
      console.log("Event status update successful");
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
    const booking = await EventBooking.findById(req.params.id);
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
    await EventBooking.findByIdAndDelete(req.params.id);
    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    res.json({ message: "Error deleting booking", error });
  }
};
