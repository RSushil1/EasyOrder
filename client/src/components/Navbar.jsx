import { useCart } from '../context/CartContext';
import { useAuth } from '../context/auth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
    const { cartCount, setIsCartOpen } = useCart();
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
        toast.success("Logout Successfully");
        navigate("/login");
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                            EasyOrder <span className="text-3xl">🍕</span>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="hidden md:flex items-center space-x-6">
                            <Link to="/" className="text-slate-600 hover:text-orange-600 font-medium transition">Home</Link>
                            {!auth.user ? (
                                <>
                                    <Link to="/register" className="text-slate-600 hover:text-orange-600 font-medium transition">Register</Link>
                                    <Link to="/login" className="text-slate-600 hover:text-orange-600 font-medium transition">Login</Link>
                                </>
                            ) : (
                                <>
                                    <span className="text-slate-800 font-medium">Hello, {auth.user.name}</span>
                                    {auth.user.role === 1 && (
                                        <Link to="/admin/dashboard" className="text-slate-600 hover:text-orange-600 font-medium transition">Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout} className="text-slate-600 hover:text-orange-600 font-medium transition">Logout</button>
                                </>
                            )}
                        </div>

                        <button
                            onClick={() => setIsCartOpen(true)}
                            className="relative p-3 text-slate-600 hover:text-orange-600 focus:outline-none transition-colors duration-200 rounded-full hover:bg-orange-50"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-sm ring-2 ring-white">
                                    {cartCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
