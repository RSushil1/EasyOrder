import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
    const {
        isCartOpen,
        setIsCartOpen,
        cartItems,
        removeFromCart,
        updateQuantity,
        cartTotal
    } = useCart();
    const navigate = useNavigate();

    if (!isCartOpen) return null;

    const handleCheckout = () => {
        setIsCartOpen(false);
        navigate('/checkout');
    };

    return (
        <div className="fixed inset-0 z-[100] overflow-hidden" aria-labelledby="slide-over-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
            <div className="fixed inset-y-0 right-0 max-w-full flex">
                <div className="w-screen max-w-md transform transition-transform ease-in-out duration-500 sm:duration-700">
                    <div className="h-full flex flex-col bg-white shadow-2xl overflow-y-scroll">
                        <div className="flex-1 py-6 overflow-y-auto px-6">
                            <div className="flex items-start justify-between border-b border-slate-100 pb-5">
                                <h2 className="text-2xl font-bold text-slate-900" id="slide-over-title">Shopping Cart</h2>
                                <div className="ml-3 h-7 flex items-center">
                                    <button
                                        type="button"
                                        className="-m-2 p-2 text-slate-400 hover:text-slate-500 transition-colors"
                                        onClick={() => setIsCartOpen(false)}
                                    >
                                        <span className="sr-only">Close panel</span>
                                        <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="mt-8">
                                {cartItems.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center h-64 text-center">
                                        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                        </div>
                                        <p className="text-slate-500 text-lg font-medium">Your cart is empty</p>
                                        <p className="text-slate-400 text-sm mt-1">Add some delicious food to get started!</p>
                                        <button
                                            onClick={() => setIsCartOpen(false)}
                                            className="mt-6 text-orange-600 font-semibold hover:text-orange-700 hover:underline"
                                        >
                                            Continue Shopping
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flow-root">
                                        <ul className="-my-6 divide-y divide-slate-100">
                                            {cartItems.map((item) => (
                                                <li key={item._id} className="py-6 flex">
                                                    <div className="flex-shrink-0 w-24 h-24 border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-full h-full object-center object-cover"
                                                        />
                                                    </div>

                                                    <div className="ml-4 flex-1 flex flex-col">
                                                        <div>
                                                            <div className="flex justify-between text-base font-medium text-slate-900">
                                                                <h3>{item.name}</h3>
                                                                <p className="ml-4 font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 flex items-end justify-between text-sm mt-2">
                                                            <div className="flex items-center border border-slate-200 rounded-lg">
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                                                    className="px-3 py-1 hover:bg-slate-50 text-slate-600 transition-colors"
                                                                >-</button>
                                                                <p className="px-3 text-slate-900 font-medium border-x border-slate-200 py-1 bg-slate-50">{item.quantity}</p>
                                                                <button
                                                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                                                    className="px-3 py-1 hover:bg-slate-50 text-slate-600 transition-colors"
                                                                >+</button>
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => removeFromCart(item._id)}
                                                                className="font-medium text-red-500 hover:text-red-700 transition-colors flex items-center group"
                                                            >
                                                                <span className="group-hover:underline">Remove</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {cartItems.length > 0 && (
                            <div className="border-t border-slate-100 py-6 px-6 bg-slate-50">
                                <div className="flex justify-between text-base font-medium text-slate-900 mb-4">
                                    <p>Subtotal</p>
                                    <p className="text-xl font-bold">${cartTotal.toFixed(2)}</p>
                                </div>
                                <p className="mt-0.5 text-sm text-slate-500 mb-6">Shipping and taxes calculated at checkout.</p>
                                <button
                                    onClick={handleCheckout}
                                    className="w-full flex justify-center items-center px-6 py-4 border border-transparent rounded-xl shadow-lg shadow-orange-200 text-base font-bold text-white bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 transition-all duration-300 transform active:scale-98"
                                >
                                    Proceed to Checkout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
