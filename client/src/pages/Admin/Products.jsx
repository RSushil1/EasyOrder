import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import axios from "axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const Products = () => {
    const [products, setProducts] = useState([]);

    //getall products
    const getAllProducts = async () => {
        try {
            const { data } = await axios.get("/api/menu/get-menu");
            setProducts(data.products);
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong");
        }
    };

    useEffect(() => {
        getAllProducts();
    }, []);

    return (
        <div className="container mx-auto p-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                    <AdminMenu />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6">
                        <h1 className="text-2xl font-bold mb-6 text-slate-800">All Products List</h1>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {products?.map((p) => (
                                <Link
                                    key={p._id}
                                    to={`/admin/product/${p.slug}`}
                                    className="group block bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300"
                                >
                                    <div className="aspect-w-16 aspect-h-9 bg-slate-100 overflow-hidden h-40">
                                        <img
                                            src={`/api/menu/food-photo/${p._id}`}
                                            className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
                                            alt={p.name}
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h5 className="text-lg font-bold text-slate-800 mb-1 truncate">{p.name}</h5>
                                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">{p.description}</p>
                                        <div className="flex justify-between items-center">
                                            <span className="text-orange-600 font-bold">${p.price}</span>
                                            <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-600">Qty: {p.quantity}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Products;
