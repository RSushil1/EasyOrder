import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AdminMenu from "../../components/Layout/AdminMenu";

const CreateFood = () => {
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [photo, setPhoto] = useState("");

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("photo", photo);
            productData.append("category", category);

            const { data } = await axios.post(
                "http://localhost:8000/api/menu/create-food",
                productData
            );
            if (data?.success) {
                toast.success("Food Created Successfully");
                navigate("/admin/dashboard");
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    };

    return (
        <div className="container mx-auto p-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                    <AdminMenu />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6 text-slate-800">Create New Food Item</h1>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <input
                                type="text"
                                value={name}
                                placeholder="Name"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                            <textarea
                                value={description}
                                placeholder="Description"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                value={price}
                                placeholder="Price"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                            <input
                                type="text"
                                value={category}
                                placeholder="Category (e.g., Pizza, Burger)"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => setCategory(e.target.value)}
                                required
                            />
                            <input
                                type="number"
                                value={quantity}
                                placeholder="Quantity"
                                className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                onChange={(e) => setQuantity(e.target.value)}
                                required
                            />
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-900 border border-slate-300 rounded-lg p-2 cursor-pointer hover:bg-slate-50 text-center">
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden
                                        required
                                    />
                                </label>
                            </div>

                            {photo && (
                                <div className="mb-3 text-center">
                                    <div className="inline-block border p-2 rounded">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive max-h-48"
                                        />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                                Create Food
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFood;
