import { NextFunction, Request, RequestHandler, Response } from "express";
import {  query, ValidationChain, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';

export const verifyEmailValidator: (ValidationChain | RequestHandler)[] = [
    query("token").notEmpty().withMessage("something went wrong"),

    query("email").notEmpty().withMessage("something went wrong").isEmail().withMessage("something went wrong"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors for each input", 422, errors);
        }
        next();
    },
];
