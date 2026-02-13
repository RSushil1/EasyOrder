import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [auth] = useAuth();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!auth?.token) {
            navigate("/login", { state: "/checkout" });
        }
    }, [auth?.token, navigate]);

    const [formData, setFormData] = useState({
        customerName: "",
        address: "",
        phone: "",
    });

    useEffect(() => {
        if (auth?.user) {
            setFormData({
                customerName: auth.user.name || '',
                address: auth.user.address || '',
                phone: auth.user.phone || '',
            });
        }
    }, [auth?.user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Map cart items to backend schema
        const cart = cartItems.map(item => ({
            food: item._id,
            quantity: item.quantity,
        }));

        try {
            const { data } = await axios.post('http://localhost:8000/api/orders/create-order', {
                cart,
                payment: formData // Using formData as payment details/shipping info for simplicity
            });

            if (data?.ok) {
                clearCart();
                toast.success("Order Placed Successfully");
                navigate(`/order-success/${data.order._id}`);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to place order");
        } finally {
            setLoading(false);
        }
    };

    if (cartItems.length === 0) {
        return <div className="text-center py-10">Your cart is empty.</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in-up">
            <h1 className="text-3xl font-bold mb-8 text-center text-slate-800">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Order Summary */}
                <div className="md:col-span-1 md:order-2">
                    <div className="bg-white shadow-lg rounded-2xl overflow-hidden sticky top-24 border border-slate-100">
                        <div className="p-6 bg-slate-50 border-b border-slate-100">
                            <h2 className="text-lg font-bold text-slate-800">Order Summary</h2>
                        </div>
                        <div className="p-6">
                            <ul className="divide-y divide-slate-100 mb-4 max-h-64 overflow-y-auto">
                                {cartItems.map(item => (
                                    <li key={item._id} className="py-3 flex justify-between group">
                                        <div>
                                            <span className="font-medium text-slate-700 block">{item.name}</span>
                                            <span className="text-xs text-slate-500">Qty: {item.quantity}</span>
                                        </div>
                                        <span className="font-semibold text-slate-900">${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="flex justify-between font-bold text-xl border-t border-slate-100 pt-4 text-slate-900">
                                <span>Total</span>
                                <span className="text-orange-600">${cartTotal.toFixed(2)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Checkout Form */}
                <div className="md:col-span-2 md:order-1">
                    <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-2xl p-8 border border-slate-100">
                        <div className="flex items-center mb-6">
                            <div className="bg-orange-100 p-2 rounded-full mr-3">
                                🍕
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Delivery Details</h2>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="customerName">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="customerName"
                                    name="customerName"
                                    value={formData.customerName}
                                    onChange={handleChange}
                                    required
                                    placeholder="John Doe"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="address">
                                    Delivery Address
                                </label>
                                <textarea
                                    id="address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    required
                                    placeholder="123 Foodie Street, Apt 4B"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50 focus:bg-white resize-none"
                                    rows="3"
                                ></textarea>
                            </div>

                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="phone">
                                    Phone Number
                                </label>
                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="+1 (555) 123-4567"
                                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all outline-none bg-slate-50 focus:bg-white"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full mt-8 bg-gradient-to-r from-orange-500 to-red-600 text-white font-bold py-4 px-6 rounded-xl hover:shadow-lg hover:from-orange-600 hover:to-red-700 transition-all transform active:scale-98 flex justify-center items-center ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
