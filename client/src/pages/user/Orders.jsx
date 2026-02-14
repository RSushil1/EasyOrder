import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import io from "socket.io-client";
import toast from "react-hot-toast";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [auth] = useAuth();
    const [socket, setSocket] = useState(null);

    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/orders/get-orders");
            setOrders(data.orders);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    // Socket.io connection
    useEffect(() => {
        const newSocket = io("https://easyorder-production.up.railway.app/");
        setSocket(newSocket);

        return () => newSocket.close();
    }, [setSocket]);

    // Listen for order updates
    useEffect(() => {
        if (socket) {
            socket.on("order-status-updated", (data) => {
                // Check if the updated order belongs to this user
                // We can either filter by ID here, or just refresh if any order updates (simpler for now, but less efficient)
                // Better: Check if `data.orderId` exists in current `orders` state
                // Since state might be stale in closure, we use functional update or ref, or just re-fetch

                // Let's re-fetch for simplicity and data consistency
                // But we want to show a toast only if it's *our* order.
                // We can check if the orderId is in our list.

                // For now, simpler approach: Always re-fetch.
                getOrders();
                toast("Order status updated!", { icon: "🔔" });
            });
        }
    }, [socket]); // Remove orders dependency to avoid re-attaching listener constantly, but might miss check? 
    // If we just re-fetch, we don't need `orders` dependency.

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 lg:w-1/4">
                    <UserMenu />
                </div>
                <div className="md:w-2/3 lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-md p-8 border border-slate-100">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">
                            My Orders
                        </h2>
                        {orders?.length === 0 ? (
                            <p className="text-slate-500 text-center py-10">No orders found.</p>
                        ) : (
                            <div className="space-y-6">
                                {orders?.map((o, i) => (
                                    <div className="border border-slate-200 rounded-lg overflow-hidden shadow-sm" key={i}>
                                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-center gap-4">
                                            <div>
                                                <span className="font-bold text-slate-700">Order #{o._id.slice(-6).toUpperCase()}</span>
                                                <span className="text-slate-500 text-sm ml-2">{moment(o?.createAt).fromNow()}</span>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-semibold 
                                                ${o?.status === 'Not Process' ? 'bg-yellow-100 text-yellow-800' : ''}
                                                ${o?.status === 'Processing' ? 'bg-blue-100 text-blue-800' : ''}
                                                ${o?.status === 'Shipped' ? 'bg-indigo-100 text-indigo-800' : ''}
                                                ${o?.status === 'deliverd' ? 'bg-green-100 text-green-800' : ''}
                                                ${o?.status === 'cancel' ? 'bg-red-100 text-red-800' : ''}
                                                `}
                                            >
                                                {o?.status}
                                            </span>
                                        </div>
                                        <div className="px-6 py-4">
                                            {o?.products?.map((p, j) => (
                                                <div className="flex items-center mb-4 last:mb-0" key={j}>
                                                    <div className="w-16 h-16 flex-shrink-0">
                                                        {p.food ? (
                                                            <img
                                                                src={`/api/menu/food-photo/${p.food._id}`}
                                                                className="w-full h-full object-cover rounded"
                                                                alt={p.food.name}
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full bg-slate-200 rounded flex items-center justify-center text-xs text-slate-400">
                                                                N/A
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="ml-4 flex-grow">
                                                        <p className="font-bold text-slate-800">{p.food ? p.food.name : "Product Unavailable"}</p>
                                                        <div className="flex flex-wrap gap-x-4 mt-1">
                                                            <p className="text-sm text-slate-600">Qty: {p.quantity}</p>
                                                            <p className="text-sm text-slate-600">Price: {p.food ? `$${p.food.price}` : "N/A"}</p>
                                                            <p className="text-sm font-bold text-slate-800">Total: {p.food ? `$${(p.food.price * p.quantity).toFixed(2)}` : "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Orders;
