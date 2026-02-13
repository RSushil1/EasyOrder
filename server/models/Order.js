import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                food: {
                    type: mongoose.ObjectId,
                    ref: "food",
                },
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        payment: {},
        buyer: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        status: {
            type: String,
            default: "Not Process",
            enum: ["Not Process", "Processing", "Shipped", "deliverd", "cancel"],
        },
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
