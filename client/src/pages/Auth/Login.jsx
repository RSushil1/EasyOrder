import React, { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../../context/auth";
import { useCart } from "../../context/CartContext";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [auth, setAuth] = useAuth();
    const [loading, setLoading] = useState(false);
    const { cartItems, setCartItems } = useCart();

    const navigate = useNavigate();
    const location = useLocation();

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post("http://localhost:8000/api/auth/login", {
                email,
                password,
                cart: cartItems, // Send local cart to merge
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                setAuth({
                    ...auth,
                    user: res.data.user,
                    token: res.data.token,
                });
                // Update context cart with merged cart from server
                if (res.data.user.cart) {
                    setCartItems(res.data.user.cart);
                    localStorage.setItem("cart", JSON.stringify(res.data.user.cart));
                }
                localStorage.setItem("auth", JSON.stringify(res.data));
                navigate(location.state || "/");
            } else {
                toast.error(res.data.message);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
            setLoading(false);
        }
    };
    return (
        <div className="flex justify-center items-center min-h-[70vh] bg-slate-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-100">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-3">
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                            placeholder="Enter Your Email"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                            placeholder="Enter Your Password"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
