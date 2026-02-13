import { useCart } from '../context/CartContext';
import { useAuth } from '../context/auth';
import axios from 'axios';
import toast from 'react-hot-toast';

const MenuItem = ({ item }) => {
    const { addToCart } = useCart();
    const [auth] = useAuth();

    const handleWishlist = async () => {
        if (!auth?.token) {
            toast.error("Please login to use wishlist");
            return;
        }
        try {
            const { data } = await axios.post("http://localhost:8000/api/auth/wishlist/toggle", { productId: item._id });
            if (data?.success) {
                toast.success(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full relative">
            <div className="relative overflow-hidden h-48">
                <img
                    src={`http://localhost:8000/api/menu/food-photo/${item._id}`}
                    alt={item.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <button
                    onClick={handleWishlist}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-slate-400 hover:text-red-500 transition-colors z-10"
                    title="Add to Wishlist"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

export default MenuItem;
