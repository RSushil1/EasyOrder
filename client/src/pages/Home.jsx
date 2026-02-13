import { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';
import axios from 'axios';

const Home = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);

    // Get Total Count
    const getTotal = async () => {
        try {
            const { data } = await axios.get("http://localhost:8000/api/menu/product-count");
            setTotal(data?.total);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getTotal();
    }, []);

    // Get Products
    const loadMore = async () => {
        try {
            setLoading(true);
            const { data } = await axios.get(`http://localhost:8000/api/menu/product-list/${page}`);
            setMenuItems(prev => [...prev, ...data?.products]);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
            setError(error.message);
        }
    };

    useEffect(() => {
        if (page === 1) return;
        loadMore();
    }, [page]);

    // Initial Load
    useEffect(() => {
        const fetchInitial = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`http://localhost:8000/api/menu/product-list/1`);
                setLoading(false);
                setMenuItems(data?.products);
            } catch (error) {
                console.log(error);
                setLoading(false);
                setError(error.message);
            }
        };
        fetchInitial();
    }, []);

    return (
        <div className="animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                    Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Delicious</span> Menu
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Choose from our wide selection of mouth-watering dishes, prepared with love and the finest ingredients.
                </p>
                <div className="w-24 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {menuItems.map(item => (
                    <MenuItem key={item._id} item={item} />
                ))}
            </div>

            {/* Infinite Scroll Trigger */}
            {menuItems.length < total && (
                <div className="mt-8 text-center text-gray-500">
                    {loading && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden border border-slate-100 flex flex-col h-full animate-pulse">
                                    <div className="w-full h-48 bg-slate-200" />
                                    <div className="p-5 flex flex-col flex-grow">
                                        <div className="h-6 bg-slate-200 rounded w-3/4 mb-4" />
                                        <div className="h-4 bg-slate-200 rounded w-full mb-2" />
                                        <div className="h-4 bg-slate-200 rounded w-5/6" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && (
                        <div
                            ref={(el) => {
                                if (el) {
                                    const observer = new IntersectionObserver(
                                        (entries) => {
                                            if (entries[0].isIntersecting && !loading) {
                                                setPage((prev) => prev + 1);
                                            }
                                        },
                                        { threshold: 0, rootMargin: "200px" }
                                    );
                                    observer.observe(el);
                                    return () => observer.disconnect();
                                }
                            }}
                            className="h-10 w-full"
                        />
                    )}
                </div>
            )}

            {error && <div className="text-center py-10 text-red-500">Error: {error}</div>}
        </div>
    );
};

export default Home;
