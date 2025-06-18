import express from "express";
import { getNoOfRooms } from "../controllers/roomController.js";
import { getRooms } from "../controllers/roomController.js";
import { getAllRooms } from "../controllers/roomController.js";
import { getRoomById } from "../controllers/roomController.js";
import { updateRoom } from "../controllers/roomController.js";
import { deleteRoom } from "../controllers/roomController.js";
import { notCleaned } from "../controllers/roomController.js";
import { markCleaned } from "../controllers/roomController.js";
import { allRooms } from "../controllers/roomController.js";

const router = express.Router();

router.get("/getnoofrooms", getNoOfRooms);
router.get("/getrooms", getRooms);
router.get("/roomids", getAllRooms);
router.get("/roomid/:id", getRoomById);
router.put("/updateroom/:id", updateRoom);
router.delete("/deleteroom/:id", deleteRoom);
router.get("/not-cleaned", notCleaned);
router.put("/mark-cleaned/:id", markCleaned);
router.get("/allrooms", allRooms);

export default router;
