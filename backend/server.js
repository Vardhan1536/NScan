import dotenv from "dotenv";
import express, { json } from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/upload.js";
import chatRoutes from "./routes/chat.js";
import User from './models/user.js';  // Import the User model
import food_scan from './routes/food_scan.js';

dotenv.config();

const app = express();
app.use(json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Routes
app.use("/auth", authRoutes);
app.use("/upload", uploadRoutes);
app.use("/chat", chatRoutes);
app.use('/user', User);
app.use('/food-scan', food_scan);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
