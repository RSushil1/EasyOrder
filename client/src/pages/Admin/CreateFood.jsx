import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

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
        <div className="container mx-auto p-4 max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Create New Food Item</h1>
            <form onSubmit={handleCreate} className="space-y-4 bg-white p-6 rounded shadow">
                <input
                    type="text"
                    value={name}
                    placeholder="Name"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <textarea
                    value={description}
                    placeholder="Description"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />
                <input
                    type="number"
                    value={price}
                    placeholder="Price"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setPrice(e.target.value)}
                    required
                />
                <input
                    type="text"
                    value={category}
                    placeholder="Category (e.g., Pizza, Burger)"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setCategory(e.target.value)}
                    required
                />
                <input
                    type="number"
                    value={quantity}
                    placeholder="Quantity"
                    className="w-full p-2 border rounded"
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                />
                <div className="mb-3">
                    <label className="block mb-2 text-sm font-medium text-gray-900">Upload Photo</label>
                    <input
                        type="file"
                        name="photo"
                        accept="image/*"
                        onChange={(e) => setPhoto(e.target.files[0])}
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>

                {photo && (
                    <div className="mb-3">
                        <div className="text-center">
                            <img
                                src={URL.createObjectURL(photo)}
                                alt="product_photo"
                                height={"200px"}
                                className="img img-responsive"
                            />
                        </div>
                    </div>
                )}

                <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Create Food
                </button>
            </form>
        </div>
    );
};

export default CreateFood;
