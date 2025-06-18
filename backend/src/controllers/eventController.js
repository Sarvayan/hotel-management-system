import Event from "../models/eventModel.js";

export const getEventTypes = async (req, res) => {
  try {
    const eventTypes = await Event.find({});

    if (eventTypes.length === 0) {
      return res.status(404).send("No events found");
    }

    res.status(200).json({ success: true, eventTypes });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Failed to fetch event types");
  }
};

export const addEvent = async (req, res) => {
  try {
    const eventNo = req.body.eventId;
    const eventType = req.body.eventName;
    const capacity = req.body.capacity;
    const cost = req.body.cost;
    const description = req.body.description;

    const newEvent = new Event({
      eventNo,
      eventType,
      capacity,
      cost,
      description,
    });

    await newEvent.save();
    console.log("Event Added To The Database Successfully");
    res.send(true);
  } catch (error) {
    console.error("Error during adding event:", error);
    res.send("Error during adding event");
  }
};

export const eventId = async (req, res) => {
  try {
    console.log("hi");
    const events = await Event.find({}, "eventType");

    if (events.length === 0) {
      return res.status(404).send("No events found");
    }

    const eventTypes = events.map((event) => event.eventType);
    console.log("hello");

    res.status(200).json({ success: true, eventTypes });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Failed to fetch event types");
  }
};

export const eventDetails = async (req, res) => {
  try {
    console.log("vanakkam");

    const event = await Event.findOne({ eventType: req.params.eventId });

    if (event) {
      console.log(event);
      res.status(200).json({ success: true, retdata: event });
    } else {
      res.status(404).json({ success: false, message: "Event not found" });
    }
  } catch (error) {
    console.error("Error fetching event details:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch event details" });
  }
};

export const updateEvent = async (req, res) => {
  const { eventId } = req.params;
  console.log(eventId);

  Event.findOneAndUpdate(
    { eventNo: eventId },
    {
      eventNo: req.body.eventId,
      eventType: req.body.eventName,
      capacity: req.body.capacity,
      cost: req.body.cost,
      description: req.body.description,
    },
    { new: true }
  )
    .then((updatedEvent) => {
      if (updatedEvent) {
        console.log("Event Updated Successfully");
        res.send(true);
      } else {
        console.log("Event Not Found");
        res.send(false);
      }
    })
    .catch((error) => {
      console.log("Error updating event:", error);
      res.send(false);
    });
};

export const deleteEvent = async (req, res) => {
  try {
    const result = await Event.findOneAndDelete({
      eventNo: req.params.eventId,
    });
    if (result) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log("Error deleting event:", error);
    res.send(false);
  }
};

export const allEvents = async (req, res) => {
  try {
    const events = await Event.find();

    if (events.length === 0) {
      return res.status(404).send("No events found");
    }

    res.status(200).json({ success: true, retdata: events });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).send("Failed to fetch event types");
  }
};
