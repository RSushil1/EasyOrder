import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../../context/CartContext";

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const { cartItems } = useCart();
    const navigate = useNavigate();

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({}); // Clear previous errors

        // Validation
        const newErrors = {};
        if (!name) newErrors.name = "Name is Required";
        if (!email) newErrors.email = "Email is Required";
        if (!password) newErrors.password = "Password is Required";
        if (!phone) newErrors.phone = "Phone no is Required";
        if (!address) newErrors.address = "Address is Required";
        if (!answer) newErrors.answer = "Answer is Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setLoading(false);
            return;
        }

        try {
            const res = await axios.post("http://localhost:8000/api/auth/register", {
                name,
                email,
                password,
                phone,
                address,
                answer,
                cart: cartItems
            });
            if (res && res.data.success) {
                toast.success(res.data && res.data.message);
                navigate("/login");
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
        <div className="flex justify-center items-center min-h-[80vh] bg-slate-50">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md border border-slate-100">
                <h1 className="text-3xl font-bold mb-6 text-center text-slate-800">Register</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            placeholder="Enter Your Name"
                        />
                        {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                    </div>
                    <div>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            placeholder="Enter Your Email"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                    </div>
                    <div>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            placeholder="Enter Your Password"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            placeholder="Enter Your Phone"
                        />
                        {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            placeholder="Enter Your Address"
                        />
                        {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                    </div>
                    <div>
                        <input
                            type="text"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                            placeholder="Security Answer (e.g. Favorite Sport)"
                        />
                        {errors.answer && <span className="text-red-500 text-sm">{errors.answer}</span>}
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                        {loading ? "Registering..." : "REGISTER"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
