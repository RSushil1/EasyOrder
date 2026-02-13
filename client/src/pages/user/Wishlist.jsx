import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";
import axios from "axios";
import { useCart } from "../../context/CartContext";
import toast from "react-hot-toast";

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [auth] = useAuth();
    const { addToCart } = useCart();

    const getWishlist = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/auth/wishlist");
            setWishlist(data.wishlist);
        } catch (error) {
            console.log(error);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const { data } = await axios.post("http://localhost:8000/api/auth/wishlist/toggle", { productId });
            if (data?.success) {
                toast.success(data.message);
                getWishlist();
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) getWishlist();
    }, [auth?.token]);

    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 lg:w-1/4">
                    <UserMenu />
                </div>
                <div className="md:w-2/3 lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-md p-8 border border-slate-100">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">
                            My Wishlist
                        </h2>
                        {wishlist.length === 0 ? (
                            <p className="text-slate-500 text-center py-10">No items in your wishlist.</p>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlist.map((p) => (
                                    <div key={p._id} className="border border-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                                        <img
                                            src={`http://localhost:8000/api/menu/food-photo/${p._id}`}
                                            className="w-full h-48 object-cover"
                                            alt={p.name}
                                        />
                                        <div className="p-4">
                                            <h5 className="text-lg font-bold text-slate-800 mb-2">{p.name}</h5>
                                            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{p.description}</p>
                                            <p className="text-orange-600 font-bold mb-4">${p.price}</p>
                                            <div className="flex gap-2">
                                                <button
                                                    className="flex-1 bg-orange-600 text-white py-2 px-3 rounded text-sm hover:bg-orange-700 transition"
                                                    onClick={() => {
                                                        addToCart(p);
                                                        toast.success("Item Added to cart");
                                                    }}
                                                >
                                                    GET NOW
                                                </button>
                                                <button
                                                    className="bg-red-100 text-red-600 py-2 px-3 rounded text-sm hover:bg-red-200 transition"
                                                    onClick={() => removeFromWishlist(p._id)}
                                                >
                                                    ✖
                                                </button>
                                            </div>
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

export default Wishlist;
