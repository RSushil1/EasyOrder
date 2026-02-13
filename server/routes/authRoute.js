import express from "express";
import {
    registerController,
    loginController,
    testController,
    getAllUsersController,
    updateCartController,
    getCartController,
} from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object
const router = express.Router();

//routing
//REGISTER || METHOD POST
router.post("/register", registerController);

//LOGIN || POST
router.post("/login", loginController);

//test
router.get("/test", requireSignIn, isAdmin, testController);

//protected User route auth
router.get("/user-auth", requireSignIn, (req, res) => {
    res.status(200).send({ ok: true });
});
//protected Admin route auth
router.get("/admin-auth", requireSignIn, isAdmin, (req, res) => {
    res.status(200).send({ ok: true });
});

//get all users
router.get("/all-users", requireSignIn, isAdmin, getAllUsersController);

//update cart
router.put("/profile/cart", requireSignIn, updateCartController);

//get cart
router.get("/profile/cart", requireSignIn, getCartController);

export default router;
