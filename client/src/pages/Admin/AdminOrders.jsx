import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select, Skeleton } from "antd"; // I installed antd earlier.
const { Option } = Select;

const AdminOrders = () => {
    const [status, setStatus] = useState([
        "Not Process",
        "Processing",
        "Shipped",
        "deliverd",
        "cancel",
    ]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [auth] = useAuth();

    const getOrders = async () => {
        try {
            const { data } = await axios.get("/api/orders/all-orders");
            setOrders(data.orders);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) getOrders();
    }, [auth?.token]);

    const handleChange = async (orderId, value) => {
        try {
            const { data } = await axios.put(`/api/orders/order-status/${orderId}`, {
                status: value,
            });
            getOrders();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="container mx-auto p-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                    <AdminMenu />
                </div>
                <div className="w-full md:w-3/4">
                    <h1 className="text-2xl font-bold mb-6 text-slate-800">All Orders</h1>
                    {loading ? (
                        [1, 2, 3].map((i) => (
                            <div key={i} className="border border-slate-200 shadow-sm rounded-lg mb-6 bg-white overflow-hidden p-6">
                                <Skeleton active avatar paragraph={{ rows: 4 }} />
                            </div>
                        ))
                    ) : (
                        orders?.map((o, i) => {
                            return (
                                <div key={o._id} className="border border-slate-200 shadow-sm rounded-lg mb-6 bg-white overflow-hidden">
                                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div>
                                            <span className="font-mono bg-white border border-slate-200 px-2 py-1 rounded text-xs text-slate-500 mr-2">#{i + 1}</span>
                                            <span className="text-sm text-slate-500">
                                                {moment(o?.createdAt).fromNow()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase
                            ${o?.status === 'Not Process' ? 'bg-gray-200 text-gray-700' : ''}
                            ${o?.status === 'Processing' ? 'bg-blue-100 text-blue-700' : ''}
                            ${o?.status === 'Shipped' ? 'bg-yellow-100 text-yellow-700' : ''}
                            ${o?.status === 'deliverd' ? 'bg-green-100 text-green-700' : ''}
                            ${o?.status === 'cancel' ? 'bg-red-100 text-red-700' : ''}
                         `}>{o?.status}</div>
                                            <Select
                                                variant={false}
                                                onChange={(value) => handleChange(o._id, value)}
                                                defaultValue={o?.status}
                                                className="w-32"
                                            >
                                                {status.map((s, i) => (
                                                    <Option key={i} value={s}>
                                                        {s}
                                                    </Option>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4 text-sm text-slate-600">
                                            <div>
                                                <p><span className="font-bold">Buyer:</span> {o?.buyer?.name}</p>
                                                <p><span className="font-bold">Payment:</span> {o?.payment.success ? "Success" : "Pending"}</p>
                                                {/* Note: Payment logic is basic for now as handled in checkout */}
                                            </div>
                                            <div>
                                                <p><span className="font-bold">Quantity:</span> {o?.products?.length}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-slate-100 pt-4">
                                            {o?.products?.map((p) => (
                                                <div className="flex items-center gap-4 mb-2 last:mb-0" key={p._id}>
                                                    <div className="w-12 h-12 bg-slate-100 rounded-md overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={`/api/menu/food-photo/${p.food?._id}`}
                                                            alt={p.food?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-slate-800">{p.food?.name}</p>
                                                        <p className="text-xs text-slate-500">{p.food?.description?.substring(0, 30)}...</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <span className="font-bold text-slate-700 block">${(p.food?.price * p.quantity).toFixed(2)}</span>
                                                        <span className="text-xs text-slate-400 block sm:inline">(${p.food?.price} x {p.quantity})</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminOrders;
