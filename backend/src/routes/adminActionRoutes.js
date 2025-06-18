import express from "express";

import { logAction } from "../controllers/adminActionController.js";

const router = express.Router();

router.post("/log-action", logAction);

export default router;
