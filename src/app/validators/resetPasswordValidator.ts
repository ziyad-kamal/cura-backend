import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, query, ValidationChain, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';

export const resetPasswordValidator: (ValidationChain | RequestHandler)[] = [
    query("token").notEmpty().withMessage("something went wrong"),

    query("email").notEmpty().withMessage("something went wrong").isEmail().withMessage("something went wrong"),

    body("password")
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8, max: 40 })
        .withMessage("password must be between 8 and 40 characters"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors for each input", 422, errors);
        }
        next();
    },
];
