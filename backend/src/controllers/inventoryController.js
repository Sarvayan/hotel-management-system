import Inventory from "../models/inventoryModel.js";

export const addProduct = async (req, res) => {
  try {
    const { pname, category, description, stock } = req.body;

    const newProduct = new Inventory({
      pname,
      category,
      description,
      stock,
      
    });

    await newProduct.save();
    console.log("Product added to the database successfully");
    res.send(true);
  } catch (error) {
    console.error("Error adding product:", error);
    res.send("Failed to add product");
  }
};

export const getProducts = async (req, res) => {
  try {
    const products = await Inventory.find();

    if (products.length === 0) {
      return res.send("No products found");
    }

    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.send("Failed to fetch products");
  }
};
