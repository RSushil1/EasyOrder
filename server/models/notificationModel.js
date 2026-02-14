import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
    {
        message: {
            type: String,
            required: true,
        },
        // If 'to' is empty, it means the notification is for ALL users (e.g. new product)
        to: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        // Users who have read this notification
        readBy: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "users",
            },
        ],
        type: {
            type: String, // 'order', 'product', 'general'
            default: "general",
        },
        metadata: {
            type: Object, // Store related IDs like orderId, productId here
        },
        docModel: {
            type: String, // 'orders', 'products' - for dynamic refs if needed later
        },
    },
    { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
