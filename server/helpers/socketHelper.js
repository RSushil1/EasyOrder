import notificationModel from "../models/notificationModel.js";

let io;

const userSocketMap = new Map(); // userId -> Set(socketIds)

export const initSocket = (socketIo) => {
    io = socketIo;
    io.on("connection", (socket) => {
        console.log("New client connected: " + socket.id);

        const userId = socket.handshake.query.userId;
        if (userId && userId !== "undefined") {
            if (!userSocketMap.has(userId)) {
                userSocketMap.set(userId, new Set());
            }
            userSocketMap.get(userId).add(socket.id);
            console.log(`User ${userId} connected on socket ${socket.id}`);
        }

        socket.on("disconnect", () => {
            console.log("Client disconnected: " + socket.id);
            if (userId && userSocketMap.has(userId)) {
                userSocketMap.get(userId).delete(socket.id);
                if (userSocketMap.get(userId).size === 0) {
                    userSocketMap.delete(userId);
                }
            }
        });
    });
};

export const getIo = () => {
    if (!io) {
        throw new Error("Socket.io not initialized!");
    }
    return io;
};

export const notifyOrderStatusUpdate = async (order) => {
    if (io) {
        const message = `Your Order #${order._id.toString().slice(-6).toUpperCase()} status is now ${order.status}`;

        const buyerId = order.buyer._id ? order.buyer._id.toString() : order.buyer.toString();

        console.log("-----------------------------------------");
        console.log("NOTIFYING ORDER UPDATE");
        console.log("Order ID:", order._id);
        console.log("Buyer ID Extracted:", buyerId);
        console.log("Message:", message);

        try {
            const notification = await new notificationModel({
                message,
                to: [buyerId], // Target specific user
                type: "order",
                metadata: { orderId: order._id },
            }).save();
            console.log("NOTIFICATION SAVED SUCCESSFULLY:", notification._id);
        } catch (err) {
            console.error("ERROR SAVING NOTIFICATION:", err);
        }

        // Emit to specific user sockets
        if (userSocketMap.has(buyerId)) {
            console.log(`Emitting to ${userSocketMap.get(buyerId).size} sockets for user ${buyerId}`);
            userSocketMap.get(buyerId).forEach(socketId => {
                io.to(socketId).emit("order-status-updated", {
                    message,
                    order,
                });
            });
        } else {
            console.log(`User ${buyerId} is NOT connected. Notification saved but not real-time emitted.`);
        }
        console.log("-----------------------------------------");
    }
};

export const notifyNewProduct = async (product) => {
    if (io) {
        const message = `New Product Alert: ${product.name} is now available!`;

        try {
            await new notificationModel({
                message,
                to: [], // Empty array = Broadcast to all
                type: "product",
                metadata: { productId: product._id },
            }).save();
        } catch (err) {
            console.error("Error saving notification:", err);
        }

        io.emit("product-created", {
            message,
            product,
        });
    }
};

export const notifyProductUpdate = async (product) => {
    if (io) {
        const message = `Product Update: ${product.name} quantity has been updated!`;

        try {
            await new notificationModel({
                message,
                to: [], // Broadcast
                type: "product",
                metadata: { productId: product._id },
            }).save();
        } catch (err) {
            console.error("Error saving notification:", err);
        }

        io.emit("product-updated", {
            message,
            product,
        });
    }
};
