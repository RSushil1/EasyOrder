import express from "express";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import {
    getUserNotifications,
    markAllRead,
    markNotificationRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// Get unread notifications
router.get("/get-notifications", requireSignIn, getUserNotifications);

// Mark single notification as read
router.put("/mark-read/:id", requireSignIn, markNotificationRead);

// Mark all as read
router.put("/mark-all-read", requireSignIn, markAllRead);

export default router;
