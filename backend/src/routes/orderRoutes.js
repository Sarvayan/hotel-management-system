import express from "express";
import { placeOrder } from "../controllers/orderController.js";
import { checkGuest } from "../controllers/orderController.js";
import { getOrder } from "../controllers/orderController.js";
import { getOrders } from "../controllers/orderController.js";
import { deleteOrderByEmail } from "../controllers/orderController.js";

const router = express.Router();

router.post("/placeorder", placeOrder);
router.get("/checkguest", checkGuest);
router.get("/getorder", getOrder);
router.get("/getorders", getOrders);
router.delete("/deletebyemail/:email", deleteOrderByEmail);

export default router;
