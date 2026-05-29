import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';

export const syncCartValidator: (ValidationChain | RequestHandler)[] = [
    body("items")
        .isArray()
        .withMessage("Items must be an array"),
    
    body("items.*.productId")
        .trim()
        .isMongoId()
        .withMessage("Invalid product ID"),
    
    body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "Invalid cart sync data", 422, errors);
        }
        next();
    },
];

export const storeCartValidator: (ValidationChain | RequestHandler)[] = [
    body("productId")
        .trim()
        .isMongoId()
        .withMessage("Invalid product ID"),
    
    body("quantity")
        .optional()
        .isInt({ min: 1 })
        .withMessage("Quantity must be a positive integer"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "Invalid product details", 422, errors);
        }
        next();
    },
];
