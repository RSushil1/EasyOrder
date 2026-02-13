import React, { useState, useEffect } from "react";
import { Modal } from 'antd';
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

    const [error, setError] = useState(""); // Keeping this for general errors if needed, but mainly switching to errors object
    const [errors, setErrors] = useState({});

    //update product function
    const handleUpdate = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        // Validation
        const newErrors = {};
        if (!name) newErrors.name = "Name is Required";
        if (!description) newErrors.description = "Description is Required";
        if (!price) newErrors.price = "Price is Required";
        if (!category) newErrors.category = "Category is Required";
        if (!quantity) newErrors.quantity = "Quantity is Required";

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

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
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = async () => {
        setIsModalOpen(false);
        try {
            const { data } = await axios.delete(`/api/menu/delete-food/${id}`);
            toast.success("Product Deleted Successfully");
            navigate("/admin/food-list");
        } catch (error) {
            console.log(error);
            toast.error("Something went wrong");
        }
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4 animate-fade-in-up">
            <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/4">
                    <AdminMenu />
                </div>
                <div className="w-full md:w-3/4">
                    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
                        <h1 className="text-2xl font-bold mb-6 text-slate-800">Update Food Item</h1>
                        <div className="space-y-4">
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
                            </div>
                            <div className="mb-3 text-center">
                                {photo ? (
                                    <div className="text-center">
                                        <img
                                            src={URL.createObjectURL(photo)}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive mx-auto rounded-lg shadow-sm"
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <img
                                            src={`http://localhost:8000/api/menu/product-photo/${id}`}
                                            alt="product_photo"
                                            height={"200px"}
                                            className="img img-responsive mx-auto rounded-lg shadow-sm"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-4">
                                <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200" onClick={handleUpdate}>
                                    UPDATE PRODUCT
                                </button>
                                <button className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200" onClick={showModal}>
                                    DELETE PRODUCT
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal title="Confirm Delete" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Are you sure you want to delete this product?</p>
            </Modal>
        </div>
    );
};

export default UpdateProduct;
