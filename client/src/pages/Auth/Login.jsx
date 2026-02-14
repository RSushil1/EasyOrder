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
    const [errors, setErrors] = useState({});
    const { cartItems, setCartItems } = useCart();

    const navigate = useNavigate();
    const location = useLocation();

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Clear previous errors

        // Validation
        const newErrors = {};
        if (!email) newErrors.email = "Email is Required";
        if (!password) newErrors.password = "Password is Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("/api/auth/login", {
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

                // Redirect logic: Prioritize intended destination, then role-based default
                const target = location.state || (res.data.user.role === 1 ? "/admin/dashboard" : "/");
                navigate(target);
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
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                    <div className="mb-3">
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                            placeholder="Enter Your Password"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Logging in..." : "LOGIN"}
                    </button>
                </form>
                <div className="mt-6 grid grid-cols-2 gap-4">
                    <div
                        onClick={() => {
                            setEmail("s@gmail.com");
                            setPassword("123456");
                            toast.success("Admin credentials filled");
                        }}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 hover:border-orange-200 transition-all active:scale-95"
                    >
                        <p className="font-semibold mb-2 text-orange-600">Admin Login</p>
                        <p className="flex justify-between"><span>Email:</span> <span className="font-mono text-slate-800">s@gmail.com</span></p>
                        <p className="flex justify-between"><span>Pass:</span> <span className="font-mono text-slate-800">123456</span></p>
                        <div className="mt-2 text-xs text-center text-orange-500 font-medium bg-orange-50 py-1 rounded">Click to Fill</div>
                    </div>

                    <div
                        onClick={() => {
                            setEmail("r@gmail.com");
                            setPassword("123456");
                            toast.success("User credentials filled");
                        }}
                        className="p-4 bg-slate-50 rounded-lg border border-slate-200 text-sm text-slate-600 cursor-pointer hover:bg-slate-100 hover:border-blue-200 transition-all active:scale-95"
                    >
                        <p className="font-semibold mb-2 text-blue-600">User Login</p>
                        <p className="flex justify-between"><span>Email:</span> <span className="font-mono text-slate-800">r@gmail.com</span></p>
                        <p className="flex justify-between"><span>Pass:</span> <span className="font-mono text-slate-800">123456</span></p>
                        <div className="mt-2 text-xs text-center text-blue-500 font-medium bg-blue-50 py-1 rounded">Click to Fill</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
