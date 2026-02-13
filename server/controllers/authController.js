import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";

export const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer, cart } = req.body;
        //validations
        if (!name) {
            return res.send({ error: "Name is Required" });
        }
        if (!email) {
            return res.send({ message: "Email is Required" });
        }
        if (!password) {
            return res.send({ message: "Password is Required" });
        }
        if (!phone) {
            return res.send({ message: "Phone no is Required" });
        }
        if (!address) {
            return res.send({ message: "Address is Required" });
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" });
        }
        //check user
        const existingUser = await userModel.findOne({ email });
        //existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "Already Register please login",
            });
        }
        //register user
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({
            name,
            email,
            phone,
            address,
            password: hashedPassword,
            answer,
            cart: cart || []
        }).save();

        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error,
        });
    }
};

//POST LOGIN
export const loginController = async (req, res) => {
    try {
        const { email, password, cart } = req.body;
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid email or password",
            });
        }
        //check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered",
            });
        }
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password",
            });
        }
        //token
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });
        // Merge cart if provided
        if (cart && cart.length > 0) {
            // Logic to merge carts: 
            // 1. Create a map of existing DB cart items
            // 2. Iterate over local cart items
            // 3. If item exists in DB cart, update quantity (or keep max, or sum - user requirement "add cart to that user", implies merging/summing or appending)
            // Let's assume summing quantities for same items, or just appending new ones.
            // A simpler approach for now: Combine and filter duplicates by food ID.

            const existingCart = user.cart || [];
            const mergedCart = [...existingCart];

            cart.forEach(localItem => {
                const existingItemIndex = mergedCart.findIndex(dbItem => dbItem._id === localItem._id);
                if (existingItemIndex > -1) {
                    // Item exists, update quantity? Or keep DB? 
                    // Let's sum quantities
                    mergedCart[existingItemIndex].quantity += localItem.quantity;
                } else {
                    // Item doesn't exist, add it
                    mergedCart.push(localItem);
                }
            });

            user.cart = mergedCart;
            await user.save();
        }

        res.status(200).send({
            success: true,
            message: "login successfully",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
                cart: user.cart,
                wishlist: user.wishlist
            },
            token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in login",
            error,
        });
    }
};

//test controller
export const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

//get all users
export const getAllUsersController = async (req, res) => {
    try {
        const users = await userModel.find({});
        res.json(users);
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting users",
            error,
        });
    }
};

//update cart
export const updateCartController = async (req, res) => {
    try {
        const { cart } = req.body;
        const user = await userModel.findById(req.user._id);
        user.cart = cart;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Cart Updated Successfully",
            cart: user.cart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while updating cart",
            error,
        });
    }
};

//get cart
export const getCartController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        res.status(200).send({
            success: true,
            cart: user.cart,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting cart",
            error,
        });
    }
};

//update profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id);
        //check valid password
        if (password && password.length < 6) {
            return res.json({ error: "Passsword is required and 6 character long" });
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                phone: phone || user.phone,
                address: address || user.address,
            },
            { new: true }
        );
        res.status(200).send({
            success: true,
            message: "Profile Updated Successfully",
            updatedUser,
        });
    } catch (error) {
        console.log(error);
        res.status(400).send({
            success: false,
            message: "Error While Update Profile",
            error,
        });
    }
};

// Toggle Wishlist
export const toggleWishlistController = async (req, res) => {
    try {
        const { productId } = req.body;
        const user = await userModel.findById(req.user._id);
        const index = user.wishlist.indexOf(productId);

        if (index === -1) {
            // Add to wishlist
            user.wishlist.push(productId);
            await user.save();
            res.status(200).send({ success: true, message: "Added to Wishlist", wishlist: user.wishlist });
        } else {
            // Remove from wishlist
            user.wishlist.splice(index, 1);
            await user.save();
            res.status(200).send({ success: true, message: "Removed from Wishlist", wishlist: user.wishlist });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Wishlist",
            error,
        });
    }
};

// Get Wishlist
export const getWishlistController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).populate("wishlist");
        res.status(200).send({
            success: true,
            wishlist: user.wishlist,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error while getting wishlist",
            error,
        });
    }
};
