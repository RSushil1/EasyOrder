import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from './models/MenuItem.js';
import connectDB from './config/db.js';

dotenv.config();
connectDB();

const menuItems = [
    {
        name: 'Margherita Pizza',
        description: 'Classic cheese and tomato pizza',
        price: 12.99,
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002',
        category: 'Pizza'
    },
    {
        name: 'Cheeseburger',
        description: 'Juicy beef patty with cheddar cheese',
        price: 9.99,
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd',
        category: 'Burger'
    },
    {
        name: 'Sushi Platter',
        description: 'Assorted fresh sushi rolls',
        price: 18.50,
        image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c',
        category: 'Sushi'
    },
    {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with caesar dressing',
        price: 8.50,
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        category: 'Salad'
    }
];

const importData = async () => {
    try {
        await MenuItem.deleteMany();
        await MenuItem.insertMany(menuItems);
        console.log('Data Imported!'.green.inverse);
        process.exit();
    } catch (error) {
        console.error(`${error}`.red.inverse);
        process.exit(1);
    }
};

importData();
