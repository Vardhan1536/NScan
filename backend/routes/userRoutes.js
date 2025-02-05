import express from "express";
import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

// Signup Route
router.post("/signup", async (req, res) => {
    console.log(req.body);
    const { username, password } = req.body;

    try {
        // Check if user exists
        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Create a new user without hashing the password here
        const newUser = new User({
            username,
            password, // The pre-save hook will handle hashing
        });

        console.log(newUser);

        await newUser.save();
        console.log("saved");
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});


// Login Route
router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    console.log(password);

    try {
        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Compare entered password with stored hashed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.status(200).json({ message: "Login successful", token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
