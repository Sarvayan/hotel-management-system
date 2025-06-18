import express from "express";
import { Login } from "../controllers/adminController.js";
import { Signup } from "../controllers/adminController.js";

const router = express.Router();

router.post("/login", Login);
router.post("/signup", Signup);

export default router;
