import { body, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";
export const commentValidator = [
    body("content")
        .trim()
        .notEmpty()
        .withMessage("content is required")
        .isLength({ min: 3 })
        .withMessage("Content must be at least 3 characters long"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
//# sourceMappingURL=commentValidator.js.map