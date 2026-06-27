const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// ✅ إنشاء أوردر جديد
router.post("/", async (req, res) => {
    try {
        const { userId, items } = req.body;
        if (!userId || !items.length) {
            return res.status(400).json({ message: "Invalid order data" });
        }

        const newOrder = new Order({
            user: userId,
            items,
            status: "Pending"
        });

        await newOrder.save();
        res.status(201).json({ message: "Order placed successfully!", order: newOrder });
    } catch (error) {
        console.error("🔥 Error placing order:", error);
        res.status(500).json({ message: "Error placing order", error: error.message });
    }
});

// ✅ الحصول على كل الأوردرات الخاصة بمستخدم معين
router.get("/:userId", async (req, res) => {
    try {
        const orders = await Order.find({ user: req.params.userId }).populate("items.id");
        res.status(200).json(orders);
    } catch (error) {
        console.error("🔥 Error fetching orders:", error);
        res.status(500).json({ message: "Error retrieving orders", error: error.message });
    }
});

module.exports = router;
