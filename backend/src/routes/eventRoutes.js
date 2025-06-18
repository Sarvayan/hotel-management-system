import express from "express";
import { getEventTypes } from "../controllers/eventController.js";
import { addEvent } from "../controllers/eventController.js";
import { eventId } from "../controllers/eventController.js";
import { eventDetails } from "../controllers/eventController.js";
import { updateEvent } from "../controllers/eventController.js";
import { deleteEvent } from "../controllers/eventController.js";
import { allEvents } from "../controllers/eventController.js";

const router = express.Router();

router.get("/geteventtypes", getEventTypes);
router.post("/addevent", addEvent);
router.post("/addevent", addEvent);
router.get("/eventids", eventId);
router.get("/eventdetails/:eventId", eventDetails);
router.put("/updateevent/:eventId", updateEvent);
router.delete("/deleteevent/:eventId", deleteEvent);
router.get("/allevents", allEvents);

export default router;
