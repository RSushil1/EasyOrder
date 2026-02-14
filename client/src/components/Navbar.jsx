import { useCart } from '../context/CartContext';
import { useAuth } from '../context/auth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Badge, Popover, Avatar, List } from "antd";
import { BellOutlined } from "@ant-design/icons"; // Make sure to install if not present, otherwise use react-icons
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useSocket } from '../context/SocketProvider';

const Navbar = () => {
    const { cartCount, setIsCartOpen, clearCart } = useCart();
    const [auth, setAuth] = useAuth();
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const socket = useSocket();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const closeMenu = () => setIsMenuOpen(false);

    const handleLogout = () => {
        setAuth({
            ...auth,
            user: null,
            token: "",
        });
        localStorage.removeItem("auth");
        clearCart(); // Clear cart on logout
        toast.success("Logout Successfully");
        navigate("/login");
        closeMenu();
    };

    // Fetch notifications
    const fetchNotifications = async (pageNum = 1, isLoadMore = false) => {
        try {
            setLoading(true);
            const { data } = await axios.get(`/api/notifications/get-notifications?page=${pageNum}&limit=5`);
            if (data?.success) {
                if (isLoadMore) {
                    setNotifications(prev => [...prev, ...data.notifications]);
                } else {
                    setNotifications(data.notifications);
                }
                setUnreadCount(data.unreadCount);
                setHasMore(data.currentPage < data.totalPages);
            }
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) {
            fetchNotifications(1, false);
        }
    }, [auth?.token]);

    const loadMoreNotifications = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            fetchNotifications(nextPage, true);
        }
    };

    // Socket listener for real-time updates
    useEffect(() => {
        if (!socket) return;

        const handleNotification = () => {
            // New notification came in, fetch page 1 again to see it at top
            // Alternatively, we could prepend it if we had the data, but fetching ensures sync
            setTimeout(() => {
                fetchNotifications(1, false);
                setPage(1); // Reset to page 1
            }, 500);
        };

        socket.on("order-status-updated", handleNotification);
        socket.on("product-created", handleNotification);
        socket.on("product-updated", handleNotification);

        return () => {
            socket.off("order-status-updated", handleNotification);
            socket.off("product-created", handleNotification);
            socket.off("product-updated", handleNotification);
        };
    }, [socket]);

    const handleRead = async (notificationId) => {
        try {
            // Optimistically update UI
            const updatedNotifications = notifications.map(n =>
                n._id === notificationId ? { ...n, readBy: [...n.readBy, auth?.user?._id] } : n
            );
            setNotifications(updatedNotifications);

            // If it was unread, decrement count
            const wasUnread = notifications.find(n => n._id === notificationId && !n.readBy.includes(auth?.user?._id));
            if (wasUnread) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }

            await axios.put(`/api/notifications/mark-read/${notificationId}`);
        } catch (error) {
            console.log(error);
            // Revert on error if needed, or just let next fetch sync it
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const { data } = await axios.put(`/api/notifications/mark-all-read`);
            if (data?.success) {
                // Update UI locally
                const updatedNotifications = notifications.map(n => ({
                    ...n,
                    readBy: [...n.readBy, auth?.user?._id] // simplistic append, safe enough for UI check
                }));
                setNotifications(updatedNotifications);
                setUnreadCount(0);
                toast.success("All marked as read");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const notificationContent = (
        <div className="bg-white rounded-lg shadow-sm w-[90vw] sm:w-[380px] flex flex-col max-h-[70vh]">
            <div className="flex justify-between items-center px-4 py-3 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-lg">
                <span className="font-bold text-gray-800 text-base">Notifications {unreadCount > 0 && <span className="text-orange-500 text-xs ml-1">({unreadCount} new)</span>}</span>
                {unreadCount > 0 && (
                    <span onClick={handleMarkAllRead} className="text-xs font-semibold text-blue-600 cursor-pointer hover:text-blue-800 transition">
                        Mark all read
                    </span>
                )}
            </div>

            <div
                className="overflow-y-auto custom-scrollbar flex-1 overscroll-contain"
            >
                <List
                    itemLayout="horizontal"
                    dataSource={notifications}
                    locale={{ emptyText: <div className="text-center py-8 text-gray-400">No notifications yet</div> }}
                    renderItem={(item) => {
                        const isRead = item.readBy.includes(auth?.user?._id);
                        return (
                            <List.Item
                                onClick={() => !isRead && handleRead(item._id)}
                                className={`cursor-pointer transition-all duration-200 px-4 py-3 border-b border-gray-50 last:border-0 ${!isRead ? 'bg-blue-50/50 hover:bg-blue-50' : 'hover:bg-gray-50'}`}
                            >
                                <List.Item.Meta
                                    avatar={
                                        <div className={`mt-1 h-2 w-2 rounded-full ${!isRead ? 'bg-orange-500 shadow-sm' : 'bg-transparent'}`}></div>
                                    }
                                    title={
                                        <p className={`text-sm mb-1 leading-snug ${!isRead ? 'font-semibold text-gray-800' : 'text-gray-600'}`}>
                                            {item.message}
                                        </p>
                                    }
                                    description={
                                        <span className="text-xs text-gray-400 font-medium">
                                            {new Date(item.createdAt).toLocaleString()}
                                        </span>
                                    }
                                />
                            </List.Item>
                        );
                    }}
                />

                {hasMore && (
                    <div className="p-2 text-center border-t border-gray-100 bg-gray-50/50">
                        <button
                            onClick={loadMoreNotifications}
                            disabled={loading}
                            className="text-xs font-semibold text-gray-600 hover:text-orange-600 transition disabled:opacity-50 py-1 px-3 rounded-full hover:bg-white"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <svg className="animate-spin h-3 w-3 text-orange-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading...
                                </span>
                            ) : "Load More"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-slate-100 transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    <div className="flex items-center">
                        {/* Mobile Menu Button - Left side or you can put it right side. Usually right side is better with cart. Let's put it left for now or keep standard. */}
                        {/* Actually, let's keep logo left. Hamburger on right usually. */}
                        <Link to="/" className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600 tracking-tight cursor-pointer hover:opacity-80 transition-opacity">
                            EasyOrder <span className="text-3xl">🍕</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Desktop Menu */}
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
                                    {auth.user.role === 1 ? (
                                        <Link to="/admin/dashboard" className="text-slate-600 hover:text-orange-600 font-medium transition">Admin Dashboard</Link>
                                    ) : (
                                        <Link to="/dashboard/user" className="text-slate-600 hover:text-orange-600 font-medium transition">Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout} className="text-slate-600 hover:text-orange-600 font-medium transition">Logout</button>
                                </>
                            )}
                        </div>

                        {/* Icons (Notification & Cart) - Visible on both mobile and desktop */}
                        <div className="flex items-center space-x-4">
                            {auth?.user && (
                                <Popover
                                    content={notificationContent}
                                    title={null}
                                    trigger="click"
                                    placement="bottomRight"
                                    overlayClassName="notification-popover"
                                >
                                    <span className="cursor-pointer inline-block">
                                        <Badge count={unreadCount} offset={[-2, 2]} size="small">
                                            <BellOutlined className="text-2xl text-slate-600 hover:text-orange-600 transition" />
                                        </Badge>
                                    </span>
                                </Popover>
                            )}

                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="relative p-2 text-slate-600 hover:text-orange-600 focus:outline-none transition-colors duration-200 rounded-full hover:bg-orange-50"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center h-5 w-5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-500 rounded-full shadow-sm ring-2 ring-white">
                                        {cartCount}
                                    </span>
                                )}
                            </button>

                            {/* Mobile Hamburger Button */}
                            <button
                                className="md:hidden text-slate-600 hover:text-orange-600 focus:outline-none ml-2"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    {isMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 absolute top-20 left-0 w-full shadow-lg flex flex-col py-4 px-6 space-y-4 animate-in slide-in-from-top-5 duration-200">
                    <Link to="/" onClick={closeMenu} className="text-lg text-slate-700 hover:text-orange-600 font-medium transition py-2 border-b border-slate-50">Home</Link>
                    {!auth.user ? (
                        <>
                            <Link to="/register" onClick={closeMenu} className="text-lg text-slate-700 hover:text-orange-600 font-medium transition py-2 border-b border-slate-50">Register</Link>
                            <Link to="/login" onClick={closeMenu} className="text-lg text-slate-700 hover:text-orange-600 font-medium transition py-2 border-b border-slate-50">Login</Link>
                        </>
                    ) : (
                        <>
                            <span className="text-slate-500 text-sm font-medium">Signed in as <span className="text-slate-800">{auth.user.name}</span></span>
                            {auth.user.role === 1 ? (
                                <Link to="/admin/dashboard" onClick={closeMenu} className="text-lg text-slate-700 hover:text-orange-600 font-medium transition py-2 border-b border-slate-50">Admin Dashboard</Link>
                            ) : (
                                <Link to="/dashboard/user" onClick={closeMenu} className="text-lg text-slate-700 hover:text-orange-600 font-medium transition py-2 border-b border-slate-50">Dashboard</Link>
                            )}
                            <button onClick={handleLogout} className="text-left text-lg text-red-500 hover:text-red-600 font-medium transition py-2">Logout</button>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
