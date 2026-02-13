import React from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import { useAuth } from "../../context/auth";

const AdminDashboard = () => {
    const [auth] = useAuth();
    return (
        <div className="container mx-auto p-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                    <AdminMenu />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-8">
                        <h1 className="text-3xl font-bold mb-6 text-slate-800 border-b pb-4">Admin Dashboard</h1>
                        <div className="space-y-4">
                            <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="font-bold w-32 text-slate-600">Admin Name:</span>
                                <span className="text-slate-900 font-medium text-lg">{auth?.user?.name}</span>
                            </div>
                            <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="font-bold w-32 text-slate-600">Admin Email:</span>
                                <span className="text-slate-900 font-medium text-lg">{auth?.user?.email}</span>
                            </div>
                            <div className="flex items-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                                <span className="font-bold w-32 text-slate-600">Admin Phone:</span>
                                <span className="text-slate-900 font-medium text-lg">{auth?.user?.phone}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
