import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.ts";
import { UserRoles } from "../../enums/UserRoles.ts";

export const signupValidator: (ValidationChain | RequestHandler)[] = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("firstName is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("firstName must be between 3 and 30 characters"),

    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("lastName is required")
        .isLength({ min: 3, max: 30 })
        .withMessage("lastName must be between 3 and 30 characters"),

    body("role")
        .trim()
        .notEmpty()
        .isEmail()
        .isIn(Object.values(UserRoles))
        .withMessage("role is required")
        .isLength({ min: 10, max: 60 })
        .withMessage("email must be between 3 and 60 characters"),

    body("email")
        .trim()
        .notEmpty()
        .isEmail()
        .withMessage("email is required")
        .isLength({ min: 10, max: 60 })
        .withMessage("email must be between 3 and 60 characters"),

    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8, max: 40 })
        .withMessage("lastName must be between 8 and 40 characters"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
