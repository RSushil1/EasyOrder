import React from "react";
import UserMenu from "../../components/Layout/UserMenu";
import { useAuth } from "../../context/auth";

const Dashboard = () => {
    const [auth] = useAuth();
    return (
        <div className="container mx-auto px-4 py-8 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/3 lg:w-1/4">
                    <UserMenu />
                </div>
                <div className="md:w-2/3 lg:w-3/4">
                    <div className="bg-white rounded-lg shadow-md p-8 border border-slate-100">
                        <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">
                            Welcome, <span className="text-orange-600">{auth?.user?.name}</span>!
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
                                <h3 className="text-lg font-semibold text-slate-700 mb-2">User Info</h3>
                                <p className="text-slate-600 mb-1"><span className="font-medium">Email:</span> {auth?.user?.email}</p>
                                <p className="text-slate-600 mb-1"><span className="font-medium">Contact:</span> {auth?.user?.phone}</p>
                                <p className="text-slate-600"><span className="font-medium">Address:</span> {auth?.user?.address}</p>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100">
                                <h3 className="text-lg font-semibold text-orange-800 mb-2">Account Status</h3>
                                <p className="text-orange-700">Active Member</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
