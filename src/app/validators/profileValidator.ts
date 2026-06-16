import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";

export const profileValidator: (ValidationChain | RequestHandler)[] = [
    body("job")
        .optional()
        .trim()
        .isLength({  max: 30 })
        .withMessage("job must be at least 2 characters long"),

    body("bio")
        .optional()
        .trim()
        .isLength({  max: 500 })
        .withMessage("bio must be at least 3 characters long"),

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("first name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("first name must be at least 2 characters long"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("last name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("last name must be at least 2 characters long"),

    body("phone")
        .optional()
        .trim()
        .matches(/^\d{11}$/)
        .withMessage("phone must be exactly 11 digits"),

    body("city")
        .optional()
        .trim()
        .isLength({ max: 50 })
        .withMessage("city must be between 2 and 50 characters"),

    body("street")
        .optional()
        .trim()
        .isLength({  max: 100 })
        .withMessage("street must be between 2 and 100 characters"),

    body("age")
        .optional()
        .isInt({ max: 120 })
        .withMessage("age must be a valid number between 1 and 120"),

    body("weight")
        .optional()
        .isFloat({  max: 500 })
        .withMessage("weight must be a valid number in kg"),

    body("height")
        .optional()
        .isFloat({  max: 300 })
        .withMessage("height must be a valid number in cm"),

    body("gender")
        .optional()
        .isIn(["male", "female"])
        .withMessage("gender must be male or female"),

    body("diseases")
        .optional()
        .trim(),

    body("medications")
        .optional()
        .trim(),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
