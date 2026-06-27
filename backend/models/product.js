

const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 }, // ✅ السعر لا يمكن أن يكون سالبًا
  category: { 
    type: String, 
    required: true, 
    enum: ["pottery", "accessories", "crochet", "artwork"], // ✅ تحديد الفئات المسموحة
  },
  images: { 
    type: [String], 
    default: [], 
    validate: {
      validator: function(arr) {
        return arr.every(url => url.startsWith("http")); // ✅ تحقق إن الروابط صحيحة
      },
      message: "All images must be valid URLs."
    }
  },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// ✅ تحديث updatedAt تلقائيًا عند التعديل
ProductSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// ✅ التأكد من عدم إعادة تعريف الموديل
const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

module.exports = Product;
