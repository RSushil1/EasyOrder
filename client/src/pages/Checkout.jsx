import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
    const { cartItems, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customerName: '',
        address: '',
        phone: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const orderData = {
            ...formData,
            items: cartItems.map(item => ({
                menuItem: item._id,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount: cartTotal
        };

        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const order = await response.json();
            clearCart();
            navigate(`/order-success/${order._id}`);
        } catch (err) {
            setError(err.message);
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
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">Delivery Details</h2>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded mb-6 flex items-start">
                                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        )}

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
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing Order...
                                </>
                            ) : 'Confirm Order'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
