import { NextFunction, Request, RequestHandler, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";
import { PostVisibility } from "../../enums/PostVisibility.js";
import { PostTag } from "../../enums/PostTag.js";

export const postValidator: (ValidationChain | RequestHandler)[] = [
    body("content")
        .trim()
        .notEmpty()
        .withMessage("content is required")
        .isLength({ min: 3 })
        .withMessage("Content must be at least 3 characters long"),

    body("visibility")
        .trim()
        .notEmpty()
        .withMessage("visibility is required")
        .isIn(Object.values(PostVisibility))
        .withMessage(`It must be ${Object.values(PostVisibility).join("or ")}`),

    body("tags").isArray({ min: 1 }).withMessage("invalid tags format"),
    body("tags.*")
        .trim()
        .isIn(Object.values(PostTag))
        .withMessage(`It must be ${Object.values(PostTag).join("or ")}`),

    body("files").isArray().withMessage("invalid files format"),

    body("files.*.url").isLength({ max: 140 }).withMessage("url mustn't be more than 140 characters long"),

    body("files.*.type").isLength({ max: 10 }).withMessage("type mustn't be more than 10 characters long"),

    (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
