import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.ts";

export const loginValidator: (ValidationChain | RequestHandler)[] = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
