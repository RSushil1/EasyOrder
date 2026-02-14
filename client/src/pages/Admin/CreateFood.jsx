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
    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const handleCreate = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        // Validation
        const newErrors = {};
        if (!name) newErrors.name = "Name is Required";
        if (!description) newErrors.description = "Description is Required";
        if (!price) newErrors.price = "Price is Required";
        if (!category) newErrors.category = "Category is Required";
        if (!quantity) newErrors.quantity = "Quantity is Required";
        if (!photo) newErrors.photo = "Photo is Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            setLoading(true);
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            productData.append("photo", photo);
            productData.append("category", category);

            const { data } = await axios.post(
                "/api/menu/create-food",
                productData
            );
            if (data?.success) {
                toast.success("Food Created Successfully");
                navigate("/admin/dashboard");
            } else {
                toast.error(data?.message);
                setLoading(false);
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
            setLoading(false);
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
                            <div>
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="Name"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setName(e.target.value)}
                                />
                                {errors.name && <span className="text-red-500 text-sm">{errors.name}</span>}
                            </div>
                            <div>
                                <textarea
                                    value={description}
                                    placeholder="Description"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                                {errors.description && <span className="text-red-500 text-sm">{errors.description}</span>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="Price"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                                {errors.price && <span className="text-red-500 text-sm">{errors.price}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    value={category}
                                    placeholder="Category (e.g., Pizza, Burger)"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setCategory(e.target.value)}
                                />
                                {errors.category && <span className="text-red-500 text-sm">{errors.category}</span>}
                            </div>
                            <div>
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="Quantity"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                                {errors.quantity && <span className="text-red-500 text-sm">{errors.quantity}</span>}
                            </div>
                            <div className="mb-3">
                                <label className="block mb-2 text-sm font-medium text-gray-900 border border-slate-300 rounded-lg p-2 cursor-pointer hover:bg-slate-50 text-center">
                                    {photo ? photo.name : "Upload Photo"}
                                    <input
                                        type="file"
                                        name="photo"
                                        accept="image/*"
                                        onChange={(e) => setPhoto(e.target.files[0])}
                                        hidden
                                    />
                                </label>
                                {errors.photo && <span className="text-red-500 text-sm text-center block">{errors.photo}</span>}
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


                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full text-white font-bold py-3 px-4 rounded-lg transition duration-200 ${loading ? 'bg-orange-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700'}`}
                            >
                                {loading ? "Processing..." : "Create Food"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateFood;
