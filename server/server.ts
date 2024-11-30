import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Optionally use CORS if handling cross-origin requests
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();

// Import the auth routes
import authRoutes from "./src/routes/authRoutes";
import pinRoutes from "./src/routes/pinRouter";
import { connectDB } from "./src/config/db";

// Load environment variables

const app = express();
app.use(cors());
// Middleware

app.use(bodyParser.json());

connectDB();

// Use auth routes for login and signup
app.use("/", authRoutes);
app.use("/", pinRoutes);

// Start the server
const PORT = 8001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
