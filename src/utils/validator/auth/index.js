const Joi = require("joi");

const loginObjects = {
  email: Joi.string().email().required().messages({
    "string.base": "email must be a string",
    "any.required": "email field is required",
    "string.empty": "email field value cannot be empty",
    "string.email": "email must be a valid email address",
  }),
  password: Joi.string().required().messages({
    "string.base": "password must be a string",
    "any.required": "password field is required",
    "string.empty": "password field value cannot be empty",
  }),
};

const registerObjects = {
  id: Joi.string().required().messages({
    "string.base": "ID must be a string",
    "any.required": "ID field is required",
  }),
  full_name: Joi.string().required().messages({
    "string.base": "Full name must be a string",
    "any.required": "Full name field is required",
  }),
  email: Joi.string().email().required().messages({
    "string.base": "Email must be a string",
    "any.required": "Email field is required",
    "string.empty": "Email field cannot be empty",
    "string.email": "Email must be a valid email address",
  }),
  password: Joi.string().min(6).required().messages({
    "string.base": "Password must be a string",
    "any.required": "Password field is required",
    "string.empty": "Password field cannot be empty",
    "string.min": "Password must be at least 6 characters long",
  })
};


module.exports = { loginObjects, registerObjects };
