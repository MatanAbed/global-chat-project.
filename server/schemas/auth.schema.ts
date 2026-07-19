import Joi from 'joi';

// 1. סכימת ולידציה עבור הרשמת משתמש חדש (Register)
export const registerSchema = Joi.object
({
  username: Joi.string().min(2).max(30).required().messages
  ({
    'string.empty': 'Username cannot be empty',
    'string.min': 'Username must be at least 2 characters long',
    'any.required': 'Username is a required field'
  }),
  email: Joi.string().email().required().messages
  ({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is a required field'
  }),
  password: Joi.string().min(6).required().messages
  ({
    'string.min': 'Password must be at least 6 characters long',
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is a required field'
  })
});

// 2. סכימת ולידציה עבור התחברות משתמש (Login)
export const loginSchema = Joi.object
({
  email: Joi.string().email().required().messages
  ({
    'string.email': 'Please provide a valid email address',
    'string.empty': 'Email cannot be empty',
    'any.required': 'Email is a required field'
  }),
  password: Joi.string().required().messages
  ({
    'string.empty': 'Password cannot be empty',
    'any.required': 'Password is a required field'
  })
});