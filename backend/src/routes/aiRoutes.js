import express from "express";

import { generateDescription } from "../controllers/aiController.js";
import { generateDenyDescription } from "../controllers/aiController.js";
import { generateEventDescription } from "../controllers/aiController.js";

const router = express.Router();

router.post("/generatedescription", generateDescription);
router.post("/generatedenydescription", generateDenyDescription);
router.post("/generateeventdescription", generateEventDescription);

export default router;
