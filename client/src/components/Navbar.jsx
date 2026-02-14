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
    const socket = useSocket();

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
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/notifications/get-notifications");
            if (data?.success) {
                setNotifications(data.notifications);
                setUnreadCount(data.total);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        if (auth?.token) {
            fetchNotifications();
        }
    }, [auth?.token]);

    // Socket listener for real-time updates
    useEffect(() => {
        if (!socket) return;

        const handleNotification = () => {
            // Add a small delay to ensure the notification is saved in DB before fetching
            setTimeout(() => {
                fetchNotifications();
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
            const { data } = await axios.put(`http://localhost:8000/api/notifications/mark-read/${notificationId}`);
            if (data?.success) {
                fetchNotifications(); // Refresh
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleMarkAllRead = async () => {
        try {
            const { data } = await axios.put(`http://localhost:8000/api/notifications/mark-all-read`);
            if (data?.success) {
                fetchNotifications();
                toast.success("All marked as read");
            }
        } catch (error) {
            console.log(error);
        }
    }

    const notificationContent = (
        <div style={{ width: 300, maxHeight: 400, overflowY: 'auto' }}>
            <div className="flex justify-between items-center mb-2 pb-2 border-b">
                <span className="font-bold text-gray-700">Notifications ({unreadCount})</span>
                {unreadCount > 0 && (
                    <span onClick={handleMarkAllRead} className="text-xs text-blue-500 cursor-pointer hover:underline">
                        Mark all read
                    </span>
                )}
            </div>
            <List
                itemLayout="horizontal"
                dataSource={notifications}
                locale={{ emptyText: "No new notifications" }}
                renderItem={(item) => (
                    <List.Item
                        onClick={() => handleRead(item._id)}
                        className={`cursor-pointer hover:bg-gray-50 transition p-2 rounded ${!item.readBy.includes(auth?.user?._id) ? 'bg-blue-50' : ''}`}
                        style={{ padding: '8px', borderBottom: '1px solid #f0f0f0' }}
                    >
                        <List.Item.Meta
                            title={<span className="text-sm text-gray-800">{item.message}</span>}
                            description={<span className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleTimeString()}</span>}
                        />
                    </List.Item>
                )}
            />
        </div>
    );

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
                                    {auth.user.role === 1 ? (
                                        <Link to="/admin/dashboard" className="text-slate-600 hover:text-orange-600 font-medium transition">Admin Dashboard</Link>
                                    ) : (
                                        <Link to="/dashboard/user" className="text-slate-600 hover:text-orange-600 font-medium transition">Dashboard</Link>
                                    )}
                                    <button onClick={handleLogout} className="text-slate-600 hover:text-orange-600 font-medium transition">Logout</button>
                                </>
                            )}
                        </div>

                        {auth?.user && (
                            <Popover
                                content={notificationContent}
                                title={null}
                                trigger="click"
                                placement="bottomRight"
                            >
                                <span className="cursor-pointer mr-4 inline-block">
                                    <Badge count={unreadCount} offset={[-2, 2]} size="small">
                                        <BellOutlined className="text-2xl text-slate-600 hover:text-orange-600 transition" />
                                    </Badge>
                                </span>
                            </Popover>
                        )}

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
