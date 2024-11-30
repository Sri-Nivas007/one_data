import Joi from "joi";

// Schema for creating a pin
export const createPinValidation = Joi.object({
  title: Joi.string().required().min(3).max(100).messages({
    "string.base": `"Title" should be a type of 'text'`,
    "string.empty": `"Title" cannot be an empty field`,
    "string.min": `"Title" should have a minimum length of {#limit}`,
    "any.required": `"Title" is a required field`
  }),
  description: Joi.string().optional().min(3).max(500).messages({
    "string.base": `"Description" should be a type of 'text'`,
    "string.empty": `"Description" cannot be an empty field`,
  }),
  tags: Joi.alternatives().try(
    Joi.array().items(Joi.string().min(3).max(30)),
    Joi.string().min(3)
  ).optional(),
  link: Joi.string().uri().optional().messages({
    "string.uri": `"link" must be a valid URL`
  }),
  // File upload should be handled in middleware, so no validation here
});

// Schema for liking/unliking a pin
export const likeValidation = Joi.object({
  id: Joi.string().required().messages({
    "string.base": `"id" should be a type of 'text'`,
    "any.required": `"id" is a required field`,
  }),
});

// Schema for following/unfollowing a user
export const followValidation = Joi.object({
  id: Joi.string().required().messages({
    "string.base": `"id" should be a type of 'text'`,
    "any.required": `"id" is a required field`,
  }),
});
