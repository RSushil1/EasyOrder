import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoute.js';
import menuRoutes from './routes/menuRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

// Connect to database
connectDB();

import http from 'http';
import { Server } from 'socket.io';
import { initSocket } from './helpers/socketHelper.js';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // allow all origins for now, or specify client URL
        methods: ["GET", "POST", "PUT", "DELETE"]
    }
});

// Make io accessible in routes/controllers
app.set('socketio', io);

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

// rest api
app.get("/", (req, res) => {
    res.send("<h1>Welcome to EasyOrder App</h1>");
});

const PORT = process.env.PORT || 8000;

// Only listen if not running on Vercel (or similar serverless identifying env var)
// However, typically for Vercel, we just export the app. Vercel looks for the export.
// If we run `node server.js` locally, we want it to listen.
if (process.env.DEV_MODE !== 'production') {
    server.listen(PORT, () => {
        console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
    });
}

// Remove the inline io.on('connection') since it is handled in initSocket now
// or we can keep a simple log if we want, but initSocket does logging too.
// For now, let's rely on initSocket.

export default app;
