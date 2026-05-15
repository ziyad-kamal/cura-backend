import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";
import { LikeType } from "../../enums/LikeType.js";

export const likeValidator: (ValidationChain | RequestHandler)[] = [
    body("type")
        .trim()
        .notEmpty()
        .withMessage("type is required")
        .isIn(Object.values(LikeType))
        .withMessage("type is post or comment"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
