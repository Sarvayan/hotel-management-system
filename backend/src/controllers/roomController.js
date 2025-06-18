import Room from "../models/roomModel.js";

export const getNoOfRooms = async (req, res) => {
  try {
    console.log("hi");
    const rooms = await Room.find({}, "roomNo");

    if (rooms.length === 0) {
      return res.status(404).send("No rooms found");
    }

    const roomNumbers = rooms.map((room) => room.roomNo);

    res.status(200).json({ success: true, roomNumbers });
  } catch (error) {
    console.error("Error fetching rooms:", error);
    res.status(500).send("Failed to fetch rooms");
  }
};

export const getRooms = async (req, res) => {
  try {
    console.log("Fetching cleaned rooms...");

    const rooms = await Room.find({ cleaningStatus: "Cleaned" });

    if (rooms.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No cleaned rooms found" });
    }

    res.status(200).json({ success: true, rooms });
  } catch (error) {
    console.error("Error fetching cleaned rooms:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch cleaned rooms" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    console.log("Fetching room numbers...");

    const rooms = await Room.find({}, { roomNo: 1, _id: 0 });

    const roomNumbers = rooms.map((room) => room.roomNo);

    console.log("Success");
    res.status(200).json({ success: true, retdata: roomNumbers });
  } catch (error) {
    console.error("Error fetching room numbers: ", error);
    res.status(500).send("Failed to fetch room numbers");
  }
};

export const getRoomById = async (req, res) => {
  try {
    const roomId = req.params.id;
    console.log(`Fetching details for room ID: ${roomId}`);

    const room = await Room.findOne({ roomNo: roomId });

    if (!room) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    console.log("Success");
    res.status(200).json({ success: true, retdata: room });
  } catch (error) {
    console.error("Error fetching room details: ", error);
    res.status(500).send("Failed to fetch room details");
  }
};

export const updateRoom = (req, res) => {
  const roomNo = req.params.id;

  Room.findOneAndUpdate(
    { roomNo: roomNo },
    {
      roomNo: req.body.roomid,
      roomtype: req.body.roomtype,
      pricePerNight: req.body.pricePerNight,
      availabilityStatus: req.body.availabilityStatus,
      cleaningStatus: req.body.cleaningStatus,
    },
    { new: true }
  )
    .then((updatedRoom) => {
      if (updatedRoom) {
        console.log("Room Updated Successfully");
        res.send(true);
      } else {
        console.log("Room Not Found");
        res.send("Room Not Found");
      }
    })
    .catch((error) => {
      console.log("Error updating Room:", error);
      res.send("Error updating Room");
    });
};

export const deleteRoom = async (req, res) => {
  try {
    const roomNo = req.params.id;

    const result = await Room.findOneAndDelete({ roomNo: roomNo });

    if (result) {
      res.send(true);
    } else {
      res.send(false);
    }
  } catch (error) {
    console.log("Error deleting room:", error);
    res.send(false);
  }
};

export const notCleaned = async (req, res) => {
  try {
    const rooms = await Room.find({ cleaningStatus: "Not Cleaned" });
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: "Error fetching rooms", error });
  }
};

export const markCleaned = async (req, res) => {
  try {
    await Room.findByIdAndUpdate(req.params.id, {
      cleaningStatus: "Cleaned",
    });
    res.json({ message: "Room marked as cleaned" });
  } catch (error) {
    res.status(500).json({ message: "Error updating room status", error });
  }
};

export const allRooms = async (req, res) => {
  try {
    const rooms = await Room.find();

    if (!rooms || rooms.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No rooms found" });
    }

    console.log("Success");
    res.json({ success: true, retdata: rooms });
  } catch (error) {
    console.error("Error fetching room numbers: ", error);
    res.status(500).send("Failed to fetch room numbers");
  }
};

