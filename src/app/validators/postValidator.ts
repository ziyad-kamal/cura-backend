import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';

export const postValidator: (ValidationChain | RequestHandler)[] = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ min: 2, max: 120 })
        .withMessage("Title must be between 3 and 120 characters"),

    body("content")
        .trim()
        .notEmpty()
        .withMessage("Content is required")
        .isLength({ min: 2 })
        .withMessage("Content must be at least 10 characters long"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // req.flash("errors", errors.mapped());
            // req.flash("old", req.body);

            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
