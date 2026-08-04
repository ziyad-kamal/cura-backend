import { body, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";
export const repostValidator = [
    body("content")
        .trim(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
//# sourceMappingURL=repostValidator.js.map