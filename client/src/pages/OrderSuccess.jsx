import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/orders/${id}`);
                if (!response.ok) throw new Error('Failed to fetch order');
                const data = await response.json();
                setOrder(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
        const interval = setInterval(fetchOrder, 3000); // Poll every 3 seconds
        return () => clearInterval(interval);
    }, [id]);

    const simulateProgress = async () => {
        if (!order) return;
        const statuses = ['Order Received', 'Preparing', 'Out for Delivery', 'Delivered'];
        const currentIndex = statuses.indexOf(order.status);
        if (currentIndex < statuses.length - 1) {
            const nextStatus = statuses[currentIndex + 1];
            try {
                await fetch(`http://localhost:5000/api/orders/${id}/status`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: nextStatus })
                });
                // State will update on next poll
            } catch (err) {
                console.error("Failed to update status", err);
            }
        }
    };

    if (loading) return <div className="text-center py-10">Loading order details...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;
    if (!order) return <div className="text-center py-10">Order not found</div>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-12 animate-fade-in-up">
            <div className="bg-white shadow-2xl rounded-3xl overflow-hidden p-8 text-center border-t-8 border-green-500">
                <div className="mb-8 relative">
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                        <span className="text-9xl">🎉</span>
                    </div>
                    <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100 mb-6 animate-bounce-slow">
                        <svg className="h-12 w-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Order Placed Successfully!</h2>
                    <p className="text-slate-500">Order ID: <span className="font-mono bg-slate-100 px-2 py-1 rounded text-slate-700">{order._id}</span></p>
                </div>

                <div className="mb-10 bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 text-slate-800">Order Status</h3>
                    <div className="flex flex-col items-center">
                        <div className={`px-6 py-3 rounded-full font-bold text-white shadow-md text-lg transition-all duration-500 ${order.status === 'Delivered' ? 'bg-green-600 shadow-green-200' :
                            order.status === 'Out for Delivery' ? 'bg-blue-600 shadow-blue-200' :
                                order.status === 'Preparing' ? 'bg-yellow-500 shadow-yellow-200' :
                                    'bg-gray-500'
                            }`}>
                            {order.status === 'Preparing' && '👨‍🍳 '}
                            {order.status === 'Out for Delivery' && '🛵 '}
                            {order.status === 'Delivered' && '✅ '}
                            {order.status}
                        </div>
                        <p className="mt-3 text-slate-500 text-sm">
                            {order.status === 'Order Received' && 'We have received your order and are checking it.'}
                            {order.status === 'Preparing' && 'Our chefs are cooking your delicious meal.'}
                            {order.status === 'Out for Delivery' && 'Your food is on the way!'}
                            {order.status === 'Delivered' && 'Enjoy your meal!'}
                        </p>
                    </div>

                    {/* Simulation Button */}
                    <button
                        onClick={simulateProgress}
                        className="mt-6 text-sm text-blue-500 hover:text-blue-700 font-medium hover:underline flex items-center justify-center mx-auto"
                    >
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        Simulate Next Step (Demo)
                    </button>
                </div>

                <div className="text-left border border-slate-100 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 border-b border-slate-100 pb-2">Order Details</h3>
                    <ul className="divide-y divide-slate-100">
                        {order.items.map((item, index) => (
                            <li key={index} className="py-3 flex justify-between items-center">
                                <span className="font-medium text-slate-700">
                                    <span className="bg-orange-100 text-orange-800 text-xs font-bold px-2 py-0.5 rounded-full mr-2">{item.quantity}x</span>
                                    {item.menuItem.name}
                                </span>
                                <span className="text-slate-600 font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="flex justify-between font-extrabold text-xl mt-4 pt-4 border-t border-slate-200 text-slate-900">
                        <span>Total Paid</span>
                        <span className="text-green-600">${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>

                <div>
                    <Link to="/" className="inline-flex items-center justify-center bg-slate-900 text-white px-8 py-4 rounded-xl hover:bg-slate-800 transition-all font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Back to Menu
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccess;
