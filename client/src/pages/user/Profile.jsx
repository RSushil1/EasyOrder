import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import toast from "react-hot-toast";
import axios from "axios";

const Profile = () => {
    //context
    const [auth, setAuth] = useAuth();
    //state
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    //get user data
    useEffect(() => {
        const { email, name, phone, address } = auth?.user;
        setName(name);
        setPhone(phone);
        setEmail(email);
        setAddress(address);
    }, [auth?.user]);

    const [error, setError] = useState(""); // Keeping for potential API errors
    const [errors, setErrors] = useState({});

    // form function
    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        // Validation (Email is disabled, so we rely on existing value)
        const newErrors = {};
        if (!name) newErrors.name = "Name is Required";
        if (!phone) newErrors.phone = "Phone is Required";
        if (!address) newErrors.address = "Address is Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const { data } = await axios.put("http://localhost:8000/api/auth/profile/update", {
                name,
                email,
                password,
                phone,
                address,
            });
            if (data?.error) {
                toast.error(data?.error);
            } else {
                setAuth({ ...auth, user: data?.updatedUser });
                let ls = localStorage.getItem("auth");
                ls = JSON.parse(ls);
                ls.user = data.updatedUser;
                localStorage.setItem("auth", JSON.stringify(ls));
                toast.success("Profile Updated Successfully");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 lg:w-1/4">
                    <UserMenu />
                </div>
                <div className="md:w-2/3 lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-md p-8 border border-slate-100">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">
                            Update Profile
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                                    placeholder="Enter your name"
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition bg-slate-100 cursor-not-allowed"
                                    placeholder="Enter your email"
                                    disabled
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                                    placeholder="Enter new password (optional)"
                                />
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="phone">Phone</label>
                                <input
                                    type="text"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition"
                                    placeholder="Enter your phone"
                                />
                                {errors.phone && <span className="text-red-500 text-sm">{errors.phone}</span>}
                            </div>
                            <div>
                                <label className="block text-slate-700 text-sm font-semibold mb-2" htmlFor="address">Address</label>
                                <textarea
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition resize-none"
                                    placeholder="Enter your address"
                                    rows="3"
                                />
                                {errors.address && <span className="text-red-500 text-sm">{errors.address}</span>}
                            </div>

                            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200">
                                UPDATE DETAILS
                            </button>
                        </form>
                    </div>
                </div>
            </div >
        </div >
    );
};

export default Profile;
