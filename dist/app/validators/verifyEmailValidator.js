import { query, validationResult } from "express-validator";
import { returnError } from '../utils/returnJson.js';
export const verifyEmailValidator = [
    query("token").notEmpty().withMessage("something went wrong"),
    query("email").notEmpty().withMessage("something went wrong").isEmail().withMessage("something went wrong"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors for each input", 422, errors);
        }
        next();
    },
];
//# sourceMappingURL=verifyEmailValidator.js.map