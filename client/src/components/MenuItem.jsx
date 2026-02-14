import { useState, memo } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';


const MenuItem = ({ item }) => {
    const { addToCart } = useCart();
    const [auth, setAuth] = useAuth();
    const [imageLoaded, setImageLoaded] = useState(false);

    // Check if item is in wishlist
    const isLiked = auth?.user?.wishlist?.includes(item._id);

    const handleWishlist = async () => {
        if (!auth?.token) {
            toast.error("Please login to use wishlist");
            return;
        }

        // Store original wishlist for revert
        const originalWishlist = [...(auth?.user?.wishlist || [])];

        // Optimistic update
        let updatedWishlist;
        if (isLiked) {
            updatedWishlist = originalWishlist.filter(id => id !== item._id);
        } else {
            updatedWishlist = [...originalWishlist, item._id];
        }

        // Update Context & LocalStorage immediately
        const optimisticUser = { ...auth.user, wishlist: updatedWishlist };
        setAuth({ ...auth, user: optimisticUser });

        // Update LocalStorage
        let ls = localStorage.getItem("auth");
        if (ls) {
            ls = JSON.parse(ls);
            ls.user = optimisticUser;
            localStorage.setItem("auth", JSON.stringify(ls));
        }

        try {
            const { data } = await axios.post("/api/auth/wishlist/toggle", { productId: item._id });
            if (data?.success) {
                toast.success(data.message);
                // Server might return the definitive list, sync it if needed, 
                // but our optimistic update should basically match. 
                // Uses server response to be sure.
                const finalUser = { ...auth.user, wishlist: data.wishlist };
                setAuth({ ...auth, user: finalUser });

                let lsFinal = localStorage.getItem("auth");
                if (lsFinal) {
                    lsFinal = JSON.parse(lsFinal);
                    lsFinal.user = finalUser;
                    localStorage.setItem("auth", JSON.stringify(lsFinal));
                }
            } else {
                // If success is false but no error thrown (rare but possible)
                throw new Error("Failed to toggle wishlist");
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");

            // Revert to original state on failure
            setAuth({ ...auth, user: { ...auth.user, wishlist: originalWishlist } });

            let lsRevert = localStorage.getItem("auth");
            if (lsRevert) {
                lsRevert = JSON.parse(lsRevert);
                lsRevert.user = { ...lsRevert.user, wishlist: originalWishlist };
                localStorage.setItem("auth", JSON.stringify(lsRevert));
            }
        }
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative animate-fade-in">
            <div className="relative overflow-hidden h-48 bg-gray-100">
                {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center z-0 bg-slate-100 animate-pulse">
                        <svg className="w-10 h-10 text-slate-200" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    </div>
                )}
                <img
                    src={`/api/menu/food-photo/${item._id}`}
                    alt={item.name}
                    className={`w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500 relative z-10 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    onLoad={() => setImageLoaded(true)}
                    loading="lazy"
                    decoding="async"
                />
                <button
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-slate-400 hover:text-red-500 transition-colors z-20"
                    title={isLiked ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-6 w-6 ${isLiked ? "text-red-500 fill-current" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                </button>
            </div>
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-3">
                    <h3 className="text-lg font-bold text-slate-800 leading-tight">{item.name}</h3>
                    <span className="text-lg font-extrabold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-md">${item.price.toFixed(2)}</span>
                </div>
                <p className="text-slate-500 text-sm mb-5 line-clamp-2 flex-grow">{item.description}</p>
                <button
                    onClick={() => {
                        addToCart(item);
                        toast.success("Item Added to cart");
                    }}
                    className="w-full bg-gradient-to-r from-orange-500 to-red-600 text-white py-2.5 px-4 rounded-xl hover:from-orange-600 hover:to-red-700 transition-all duration-300 font-semibold shadow-lg shadow-orange-200 transform active:scale-95"
                >
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default memo(MenuItem);
