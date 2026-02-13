import orderModel from "../models/Order.js";

//create orders
export const createOrderController = async (req, res) => {
    try {
        const { cart, payment } = req.body;
        console.log("Create Order Request Body:", req.body);
        console.log("Cart Type:", typeof cart);
        console.log("Cart Value:", cart);
        const order = await new orderModel({
            products: cart,
            payment: payment || {},
            buyer: req.user._id,
        }).save();
        // Return the created order so frontend can redirect
        res.status(201).send({
            ok: true,
            success: true,
            message: "Order Created Successfully",
            order,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error While Creating Order",
        });
    }
};

//get orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products.food", "-photo")
            .populate("buyer", "name");
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting Orders",
            error,
        });
    }
};

//get single order
export const getSingleOrderController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await orderModel
            .findById(orderId)
            .populate("products.food", "-photo")
            .populate("buyer", "name");
        res.json(order);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting Single Order",
            error,
        });
    }
};

//all orders
export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({})
            .populate("products.food", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Geting Orders",
            error,
        });
    }
};

//order status
export const orderStatusController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const orders = await orderModel.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        );
        res.json(orders);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error While Updateing Order",
            error,
        });
    }
};
