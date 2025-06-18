import express from "express";

import { guestBlacklistAccount } from "../controllers/guestBlacklistController.js";
import { getBlacklistAccount } from "../controllers/guestBlacklistController.js";

const router = express.Router();

router.delete("/deleteguest", guestBlacklistAccount);
router.get("/getblacklist", getBlacklistAccount);

export default router;
