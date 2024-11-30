import { Request, Response, NextFunction } from "express";
import Joi from "joi";

// Custom validation middleware
export const validateBody = (schema: Joi.ObjectSchema) => {
    return (req: Request, res: Response, next: NextFunction): any => {
        // Return type changed to `any`
        const { error } = schema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details.map((e) => e.message),
            });
        }
        next(); // Proceed to the next middleware if validation passes
    };
};
