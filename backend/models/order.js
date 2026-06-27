const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // المشتري
    items: [{
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        title: String,
        price: Number,
        quantity: { type: Number, required: true }
    }],
    totalPrice: { type: Number, required: true }, // إجمالي السعر
    status: { 
        type: String, 
        enum: ["pending", "shipped", "delivered"], 
        default: "pending" 
    }, // حالة الطلب
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", OrderSchema);
