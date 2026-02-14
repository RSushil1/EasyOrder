import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoute.js";
import menuRoutes from "./routes/menuRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./helpers/socketHelper.js";

import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Connect DB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
    cors: {
        origin: "*", // You can restrict later
        methods: ["GET", "POST", "PUT", "DELETE"],
    },
});

initSocket(io);

// Make io available in controllers
app.set("socketio", io);

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/notifications", notificationRoutes);

// ------------------ SERVE REACT BUILD ------------------
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get(/(.*)/, (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
