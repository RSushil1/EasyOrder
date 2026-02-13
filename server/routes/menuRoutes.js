import express from "express";
import {
    createFoodController,
    deleteFoodController,
    foodPhotoController,
    getMenu,
    getSingleFood,
    updateFoodController,
} from "../controllers/menuController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import formidable from "express-formidable";

const router = express.Router();

//routes
//create food
router.post(
    "/create-food",
    requireSignIn,
    isAdmin,
    formidable(),
    createFoodController
);

//update food
router.put(
    "/update-food/:pid",
    requireSignIn,
    isAdmin,
    formidable(),
    updateFoodController
);

//get food
router.get("/get-menu", getMenu);

//single food
router.get("/get-food/:slug", getSingleFood);

//get photo
router.get("/food-photo/:pid", foodPhotoController);

//delete food
router.delete("/delete-food/:pid", requireSignIn, isAdmin, deleteFoodController);

export default router;
