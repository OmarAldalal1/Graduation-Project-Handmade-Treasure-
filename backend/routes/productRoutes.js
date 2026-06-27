const express = require("express");
const mongoose = require("mongoose");
const Product = require("../models/product");
const { authorizeSeller } = require("../middleware/authorize");

const router = express.Router();

// 🔹 1️⃣ Create a New Product (POST)
router.post("/", authorizeSeller, async (req, res) => {
  try {
    const { title, description, price, category, images, seller } = req.body;

    if (!title || !description || !price || !category || !images || !seller) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const sellerObjectId = new mongoose.Types.ObjectId(seller);

    const newProduct = new Product({
      title,
      description,
      price,
      category,
      images,
      seller: sellerObjectId,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added successfully!", product: newProduct });
  } catch (error) {
    console.error("🔥 Error adding product:", error);
    res.status(500).json({ message: "Error adding product", error: error.message });
  }
});

// 🔹 2️⃣ Get All Products or Filter by Category (GET)
router.get("/", async (req, res) => {
  try {
    const { category } = req.query; // Get category from query params
    let filter = {}; 

    if (category) {
      filter.category = category; // Add category to filter
    }

    const products = await Product.find(filter).populate("seller", "name email");
    console.log("📌 Filtered Products:", products);
    
    res.status(200).json(products);
  } catch (error) {
    console.error("🔥 Error fetching products:", error);
    res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
});

// 🔹 3️⃣ Get a Single Product by ID (GET)
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const product = await Product.findById(id).populate("seller", "name email");
    if (!product) return res.status(404).json({ message: "Product not found" });

    res.status(200).json(product);
  } catch (error) {
    console.error("🔥 Error fetching product:", error);
    res.status(500).json({ message: "Error retrieving product", error: error.message });
  }
});

// 🔹 4️⃣ Update a Product (PUT)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product updated successfully!", product: updatedProduct });
  } catch (error) {
    console.error("🔥 Error updating product:", error);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
});

// 🔹 5️⃣ Delete a Product (DELETE)
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid product ID" });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });

    res.status(200).json({ message: "Product deleted successfully!" });
  } catch (error) {
    console.error("🔥 Error deleting product:", error);
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
});
/////search
router.get("/search", async (req, res) => {
  const { category, product } = req.query; // الحصول على query parameters

  let query = {};  // بناء الـ query

  if (category) {
      query.category = category;  // إضافة category للبحث
  }

  if (product) {
      query.title = { $regex: product, $options: "i" };  // البحث باستخدام regex في اسم المنتج
  }

  try {
      const products = await Product.find(query);  // جلب المنتجات المتوافقة مع الـ query
      console.log(products);
      res.json(products);  // إرجاع المنتجات
  } catch (error) {
      console.error("Error fetching products:", error);
      res.status(500).json({ message: "Error retrieving products", error: error.message });
  }
});


module.exports = router;

