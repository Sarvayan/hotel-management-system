import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  pname: String,
  category: String,
  description: String,
  stock: Number,
});

const Inventory = mongoose.model("Inventory", inventorySchema, "inventory");

export default Inventory;
