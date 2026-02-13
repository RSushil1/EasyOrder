import { useState, useEffect } from 'react';
import MenuItem from '../components/MenuItem';

const Home = () => {
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchMenu = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/menu');
                if (!response.ok) {
                    throw new Error('Failed to fetch menu');
                }
                const data = await response.json();
                setMenuItems(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMenu();
    }, []);

    if (loading) return <div className="text-center py-10">Loading menu...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

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
        </div>
    );
};

export default Home;
