import express from "express";
import { signup, login, getProfile } from "../controllers/authControllers";
import { verifyToken } from "../middlewares/jwt";
import {
   
    validateLogin,
    validateSignup,
} from "../middlewares/validate";

const router = express.Router();
router.post("/signup", validateSignup, signup);


router.post("/login", validateLogin, login);


router.get("/profile", verifyToken, getProfile);

export default router;
