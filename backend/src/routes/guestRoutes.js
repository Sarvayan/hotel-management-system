import express from "express";

import { logoutGuest } from "../controllers/guestController.js";

import { guestRegistration } from "../controllers/guestController.js";
import { getDashboard } from "../controllers/guestController.js";
import { updateGuest } from "../controllers/guestController.js";
import { newPassword } from "../controllers/guestController.js";
import { findGuest } from "../controllers/guestController.js";
import { getGuest } from "../controllers/guestController.js";
import { checkGuest } from "../controllers/guestController.js";

const router = express.Router();


router.post("/logout", logoutGuest);

router.post("/registration", guestRegistration);
router.get("/dashboard", getDashboard);
router.put("/updateguest", updateGuest);
router.put("/newpassword", newPassword);
router.get("/viewguest/:id", findGuest);
router.get("/getguest", getGuest);
router.get("/checkguest", checkGuest);


export default router;
