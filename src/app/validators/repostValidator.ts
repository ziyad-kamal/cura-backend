import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";

export const repostValidator: (ValidationChain | RequestHandler)[] = [
    body("content")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Content must be at least 3 characters long"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
