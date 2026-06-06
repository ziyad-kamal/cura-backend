import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";

export const profileValidator: (ValidationChain | RequestHandler)[] = [
    body("job")
        .trim()
        .notEmpty()
        .withMessage("job is required")
        .isLength({ min: 3 , max: 30 })
        .withMessage("job must be at least 3 characters long"),

    body("bio")
        .trim()
        .notEmpty()
        .withMessage("bio is required")
        .isLength({ min: 3, max: 250 })
        .withMessage("bio must be at least 3 characters long"),

    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("first name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("first name must be at least 3 characters long"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("last name is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("last name must be at least 3 characters long"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
