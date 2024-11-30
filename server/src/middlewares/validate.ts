import { Request, Response, NextFunction } from "express";
import {
    signupValidation,
    loginValidation,
    getProfileValidation,
} from "../middlewares/validations/authValidations";

// Middleware for Signup validation
export const validateSignup = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = signupValidation(req.body);
    if (error) {
        // Send the response if validation fails
        res.status(400).json({ message: error.details.map((e) => e.message) });
        return;  // No need to explicitly return the response here
    }
    next(); // Proceed to the next middleware if validation passes
};

// Middleware for Login validation
export const validateLogin = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = loginValidation(req.body);
    if (error) {
        // Send the response if validation fails
        res.status(400).json({ message: error.details.map((e) => e.message) });
        return;  // No need to explicitly return the response here
    }
    next(); // Proceed to the next middleware if validation passes
};

// Middleware for Get Profile validation
export const validateGetProfile = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const { error } = getProfileValidation(req.params); // Assuming userId is in params or header
    if (error) {
        // Send the response if validation fails
        res.status(400).json({ message: error.details.map((e) => e.message) });
        return;  // No need to explicitly return the response here
    }
    next(); // Proceed to the next middleware if validation passes
};
