import foodModel from "../models/foodModel.js";
import fs from "fs";
import slugify from "slugify";

import { notifyNewProduct, notifyProductUpdate } from "../helpers/socketHelper.js";

// ... imports

//create food
export const createFoodController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.body;
        const photo = req.file;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 10000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 10mb" });
        }

        const products = new foodModel({ ...req.body, slug: slugify(name) });
        if (photo) {
            products.photo.data = photo.buffer;
            products.photo.contentType = photo.mimetype;
        }
        await products.save();

        // Notify about new product
        notifyNewProduct(products);

        res.status(201).send({
            success: true,
            message: "Food Created Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in creating product",
        });
    }
};



//get all items
export const getMenu = async (req, res) => {
    try {
        const products = await foodModel
            .find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            countTotal: products.length,
            message: "ALlProducts ",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr in getting products",
            error: error.message,
        });
    }
};

// get single food
export const getSingleFood = async (req, res) => {
    try {
        const product = await foodModel
            .findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");
        res.status(200).send({
            success: true,
            message: "Single Product Fetched",
            product,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Eror while getitng single product",
            error,
        });
    }
};

// get photo
export const foodPhotoController = async (req, res) => {
    try {
        if (!req.params.pid || req.params.pid === "undefined" || req.params.pid === "null") {
            return res.status(400).send({ error: "Invalid product ID" });
        }
        const product = await foodModel.findById(req.params.pid).select("photo");
        if (product.photo.data) {
            res.set("Content-type", product.photo.contentType);
            return res.status(200).send(product.photo.data);
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Erorr while getting photo",
            error,
        });
    }
};

//delete controller
export const deleteFoodController = async (req, res) => {
    try {
        await foodModel.findByIdAndDelete(req.params.pid).select("-photo");
        res.status(200).send({
            success: true,
            message: "Food Deleted successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while deleting product",
            error,
        });
    }
};

//update items
export const updateFoodController = async (req, res) => {
    try {
        const { name, description, price, category, quantity, shipping } =
            req.body;
        const photo = req.file;
        //validation
        switch (true) {
            case !name:
                return res.status(500).send({ error: "Name is Required" });
            case !description:
                return res.status(500).send({ error: "Description is Required" });
            case !price:
                return res.status(500).send({ error: "Price is Required" });
            case !category:
                return res.status(500).send({ error: "Category is Required" });
            case !quantity:
                return res.status(500).send({ error: "Quantity is Required" });
            case photo && photo.size > 1000000:
                return res
                    .status(500)
                    .send({ error: "photo is Required and should be less then 1mb" });
        }

        const products = await foodModel.findByIdAndUpdate(
            req.params.pid,
            { ...req.body, slug: slugify(name) },
            { new: true }
        );
        if (photo) {
            products.photo.data = photo.buffer;
            products.photo.contentType = photo.mimetype;
        }
        await products.save();

        // Notify about product update
        notifyProductUpdate(products);

        res.status(201).send({
            success: true,
            message: "Food Updated Successfully",
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            error,
            message: "Error in Updte product",
        });
    }
};
// product count
export const productCountController = async (req, res) => {
    try {
        const total = await foodModel.find({}).estimatedDocumentCount();
        res.status(200).send({
            success: true,
            total,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            message: "Error in product count",
            error,
            success: false,
        });
    }
};

// product list base on page
export const productListController = async (req, res) => {
    try {
        const perPage = 12;
        const page = req.params.page ? req.params.page : 1;
        const products = await foodModel
            .find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });
        res.status(200).send({
            success: true,
            products,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "error in per page ctrl",
            error,
        });
    }
};
