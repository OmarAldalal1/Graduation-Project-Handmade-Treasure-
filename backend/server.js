const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

// ✅ تقديم ملفات الفرونت من `frontend/`
app.use(express.static(path.join(__dirname, "../frontend")));

// ✅ عرض `landing.html` عند زيارة `http://localhost:5000/`
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/landing.html"));
});

// ✅ عرض `index.html` عند الضغط على `Shop Now` (موجود في `landing.html`)
app.get("/shop", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ✅ مسارات المستخدمين (Register / Login)
const userRoutes = require("./routes/userRoutes");
app.use("/api/users", userRoutes);

// productRoutes 
const productRoutes = require("./routes/productRoutes");
app.use("/api/products", productRoutes);
// order route 
const orderRoutes = require("./routes/orderRoutes"); 
app.use("/api/orders", orderRoutes);
// بعد تعريف app
const searchRoutes = require('./routes/searchRoutes');
app.use('/search', searchRoutes); // تمام كده


// ✅ الاتصال بقاعدة البيانات
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});


