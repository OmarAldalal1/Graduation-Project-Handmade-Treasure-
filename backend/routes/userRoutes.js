const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// 🔹 1️⃣ Register a New User
router.post("/register", async (req, res) => {
    console.log("✅ Register API Hit");

    try {
        const { name, email, password, role } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "Email is already registered" });

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const newUser = new User({ name, email, password: hashedPassword, role });
        await newUser.save();

        res.status(201).json({ message: "Registration successful!" });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during registration", error });
    }
});

// 🔹 2️⃣ User Login
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        // Check if the password is correct
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ message: "Invalid password" });

        // Generate JWT token
        const token = jwt.sign({ userId: user._id, role: user.role }, "secret_key", { expiresIn: "1h" });

        res.json({ message: "Login successful!", token, user });
    } catch (error) {
        res.status(500).json({ message: "An error occurred during login", error });
    }
});

module.exports = router;
console.log("🔹 User Routes Loaded");
console.log("✅ User Routes Loaded in server.js");



