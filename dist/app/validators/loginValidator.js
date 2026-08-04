import { body, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';
export const loginValidator = [
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required"),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
//# sourceMappingURL=loginValidator.js.map