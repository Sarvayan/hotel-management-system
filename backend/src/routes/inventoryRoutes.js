import express from "express";
import { addProduct } from "../controllers/inventoryController.js";
import { getProducts } from "../controllers/inventoryController.js";

const router = express.Router();

router.post("/addproduct", addProduct);
router.get("/getproducts", getProducts);

export default router;
