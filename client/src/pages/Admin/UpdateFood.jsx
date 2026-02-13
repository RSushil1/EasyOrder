import React, { useState, useEffect } from "react";
import AdminMenu from "../../components/Layout/AdminMenu";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const UpdateProduct = () => {
    const navigate = useNavigate();
    const params = useParams();
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState("");
    const [photo, setPhoto] = useState("");
    const [id, setId] = useState("");

    //get single product
    const getSingleProduct = async () => {
        try {
            const { data } = await axios.get(
                `/api/menu/get-food/${params.slug}`
            );
            setName(data.product.name);
            setId(data.product._id);
            setDescription(data.product.description);
            setPrice(data.product.price);
            setQuantity(data.product.quantity);
            setCategory(data.product.category);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        getSingleProduct();
        //eslint-disable-next-line
    }, []);

    //update product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const productData = new FormData();
            productData.append("name", name);
            productData.append("description", description);
            productData.append("price", price);
            productData.append("quantity", quantity);
            photo && productData.append("photo", photo);
            productData.append("category", category);
            const { data } = await axios.put(
                `/api/menu/update-food/${id}`,
                productData
            );
            if (data?.success) {
                toast.success("Food Updated Successfully"); // Corrected toast message
                navigate("/admin/food-list");
            } else {
                toast.error(data?.message);
            }
        } catch (error) {
            console.log(error);
            toast.error("something went wrong");
        }
    };

    //delete a product
    const handleDelete = async () => {
        try {
            let answer = window.confirm("Are You Sure want to delete this product ?");
            if (!answer) return;
            const { data } = await axios.delete(
                `/api/menu/delete-food/${id}`
            );
            toast.success("Food Deleted Successfully");
            navigate("/admin/food-list");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
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
                        <h1 className="text-2xl font-bold mb-6 text-slate-800">Update Product</h1>
                        <div className="md:w-3/4 mx-auto space-y-4">
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={name}
                                    placeholder="write a name"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setName(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <textarea
                                    type="text"
                                    value={description}
                                    placeholder="write a description"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setDescription(e.target.value)}
                                />
                            </div>

                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={price}
                                    placeholder="write a Price"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setPrice(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="number"
                                    value={quantity}
                                    placeholder="write a quantity"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setQuantity(e.target.value)}
                                />
                            </div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={category}
                                    placeholder="write a Category"
                                    className="w-full p-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    onChange={(e) => setCategory(e.target.value)}
                                />
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
                            </div>
                            <div className="mb-3 text-center">
                                {photo ? (
                                    <div className="inline-block border p-2 rounded">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive max-h-48"
                                        />
                                    </div>
                                ) : (
                                    <div className="inline-block border p-2 rounded">
                                        <img
                                            src={`/api/menu/food-photo/${id}`}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive max-h-48"
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="flex gap-4">
                                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200" onClick={handleUpdate}>
                                    UPDATE PRODUCT
                                </button>
                                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200" onClick={handleDelete}>
                                    DELETE PRODUCT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpdateProduct;
