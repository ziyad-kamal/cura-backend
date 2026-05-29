import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, param, ValidationChain, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';

export const createOrderValidator: (ValidationChain | RequestHandler)[] = [
    body("shippingAddress.city")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("City is required")
        .isLength({ min: 2, max: 100 })
        .withMessage("City must be between 2 and 100 characters"),
    
    body("shippingAddress.street")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Street is required")
        .isLength({ min: 3, max: 200 })
        .withMessage("Street must be between 3 and 200 characters"),

    body("shippingAddress.name")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Name is required")
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be between 2 and 50 characters"),

    body("shippingAddress.email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Please provide a valid email address")
        .normalizeEmail(),

    body("shippingAddress.phone")
        .trim()
        .notEmpty()
        .withMessage("Phone number is required")
        .matches(/^\+?[0-9\s\-()]{7,20}$/)
        .withMessage("Please provide a valid phone number (7-20 digits, optionally starting with +)"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "Invalid shipping address details", 422, errors);
        }
        next();
    },
];

export const orderIdValidator: (ValidationChain | RequestHandler)[] = [
    param("id")
        .isMongoId()
        .withMessage("Invalid order ID"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "Invalid order parameters", 422, errors);
        }
        next();
    },
];
