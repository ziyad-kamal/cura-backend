import { body, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';
export const forgetPasswordValidator = [
    body("email")
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email")
        .isLength({ min: 10, max: 150 })
        .withMessage("email must be between 10 and 150 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
//# sourceMappingURL=forgetPasswordValidator.js.map