import Joi from "joi";

// Validation for the Signup route
export const signupValidation = (data: any) => {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required().messages({
            "string.base": "Name must be a string",
            "string.empty": "Name cannot be empty",
            "string.min": "Name must be at least 3 characters",
            "string.max": "Name must be at most 50 characters",
            "any.required": "Name is required",
        }),
        email: Joi.string().email().required().messages({
            "string.email": "Please enter a valid email",
            "any.required": "Email is required",
        }),
        password: Joi.string().min(6).required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password cannot be empty",
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required",
        }),
    });

    return schema.validate(data, { abortEarly: false });
};

// Validation for the Login route
export const loginValidation = (data: any) => {
    const schema = Joi.object({
        email: Joi.string().email().required().messages({
            "string.email": "Please enter a valid email",
            "any.required": "Email is required",
        }),
        password: Joi.string().min(6).required().messages({
            "string.base": "Password must be a string",
            "string.empty": "Password cannot be empty",
            "string.min": "Password must be at least 6 characters",
            "any.required": "Password is required",
        }),
    });

    return schema.validate(data, { abortEarly: false });
};

// Validation for the Get Profile route
export const getProfileValidation = (data: any) => {
    const schema = Joi.object({
        userId: Joi.string().required().messages({
            "string.base": "User ID must be a string",
            "any.required": "User ID is required",
        }),
    });

    return schema.validate(data, { abortEarly: false });
};
