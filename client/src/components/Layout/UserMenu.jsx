import { NavLink } from "react-router-dom";

const UserMenu = () => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden border border-slate-100">
            <div className="bg-gradient-to-r from-orange-500 to-red-600 p-4">
                <h4 className="text-xl font-bold text-white text-center">Dashboard</h4>
            </div>
            <div className="flex flex-col">
                <NavLink
                    to="/dashboard/user/profile"
                    className={({ isActive }) =>
                        `px-6 py-4 border-b border-slate-100 hover:bg-orange-50 transition-colors font-medium ${isActive ? "text-orange-600 bg-orange-50 border-l-4 border-l-orange-500" : "text-slate-600"}`
                    }
                >
                    Profile
                </NavLink>
                <NavLink
                    to="/dashboard/user/orders"
                    className={({ isActive }) =>
                        `px-6 py-4 border-b border-slate-100 hover:bg-orange-50 transition-colors font-medium ${isActive ? "text-orange-600 bg-orange-50 border-l-4 border-l-orange-500" : "text-slate-600"}`
                    }
                >
                    Orders
                </NavLink>
                <NavLink
                    to="/dashboard/user/wishlist"
                    className={({ isActive }) =>
                        `px-6 py-4 hover:bg-orange-50 transition-colors font-medium ${isActive ? "text-orange-600 bg-orange-50 border-l-4 border-l-orange-500" : "text-slate-600"}`
                    }
                >
                    Wishlist
                </NavLink>
            </div>
        </div>
    );
};

export default UserMenu;
