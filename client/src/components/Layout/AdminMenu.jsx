import React from "react";
import { Link } from "react-router-dom";

const AdminMenu = () => {
    return (
        <div className="text-center">
            <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                <h4 className="bg-slate-50 border-b border-slate-200 p-4 font-bold text-slate-800">Admin Panel</h4>
                <div className="flex flex-col">
                    <Link
                        to="/admin/create-food"
                        className="p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-slate-100 text-slate-600 font-medium"
                    >
                        Create Food
                    </Link>
                    <Link
                        to="/admin/food-list"
                        className="p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-slate-100 text-slate-600 font-medium"
                    >
                        Products
                    </Link>
                    <Link
                        to="/admin/orders"
                        className="p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b border-slate-100 text-slate-600 font-medium"
                    >
                        Orders
                    </Link>
                    <Link
                        to="/admin/users"
                        className="p-3 hover:bg-orange-50 hover:text-orange-600 transition-colors text-slate-600 font-medium"
                    >
                        Users
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AdminMenu;
