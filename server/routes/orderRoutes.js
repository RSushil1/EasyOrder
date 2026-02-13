import express from "express";
import {
    createOrderController,
    getAllOrdersController,
    getOrdersController,
    getSingleOrderController,
    orderStatusController,
} from "../controllers/orderController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router();

//orders
router.post("/create-order", requireSignIn, createOrderController);

//get orders
router.get("/get-orders", requireSignIn, getOrdersController);

//get single order - Using :orderId parameter
// Note: This must come before generic routes if there were any, but here it's fine.
// Also, should be protected.
router.get("/:orderId", requireSignIn, getSingleOrderController);

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

// order status update
router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
);

export default router;
