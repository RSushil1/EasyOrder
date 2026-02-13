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

//all orders
router.get("/all-orders", requireSignIn, isAdmin, getAllOrdersController);

//get single order
router.get("/:orderId", requireSignIn, getSingleOrderController);

// order status update
router.put(
    "/order-status/:orderId",
    requireSignIn,
    isAdmin,
    orderStatusController
);

export default router;
