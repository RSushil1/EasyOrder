import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Skeleton } from "antd";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [auth] = useAuth();

    //get all users
    const getAllUsers = async () => {
        try {
            // I need to create an endpoint for getting all users in authController/Route first.
            // But for now I will assume it exists or I will create it.
            // Wait, I haven't created it yet. I should create it efficiently.
            // I will create a new route in authRoute `get-users`.
            const { data } = await axios.get("/api/auth/all-users");
            setUsers(data.users);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    useEffect(() => {
        if (auth?.token) getAllUsers();
    }, [auth?.token]);

    return (
        <div className="container mx-auto p-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                    <AdminMenu />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6 text-slate-800">All Users</h1>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">#</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Name</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Phone</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-200">
                                    {loading ? (
                                        [1, 2, 3, 4, 5].map((i) => (
                                            <tr key={i}>
                                                <td className="px-6 py-4"><Skeleton active paragraph={false} /></td>
                                                <td className="px-6 py-4"><Skeleton active paragraph={false} /></td>
                                                <td className="px-6 py-4"><Skeleton active paragraph={false} /></td>
                                                <td className="px-6 py-4"><Skeleton active paragraph={false} /></td>
                                                <td className="px-6 py-4"><Skeleton active paragraph={false} /></td>
                                            </tr>
                                        ))
                                    ) : (
                                        users?.map((u, i) => (
                                            <tr key={u._id} className="hover:bg-slate-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{i + 1}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{u.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.email}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{u.phone}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 1 ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                                        {u.role === 1 ? "Admin" : "User"}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
