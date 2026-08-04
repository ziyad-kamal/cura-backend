import { body, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";
import User from "../models/User.js";
export const signupValidator = [
    body("firstName")
        .trim()
        .notEmpty()
        .withMessage("firstName is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("firstName must be between 2 and 30 characters"),
    body("lastName")
        .trim()
        .notEmpty()
        .withMessage("lastName is required")
        .isLength({ min: 2, max: 30 })
        .withMessage("lastName must be between 2 and 30 characters"),
    body("email")
        .trim()
        .notEmpty()
        .withMessage("email is required")
        .isEmail()
        .withMessage("invalid email")
        .isLength({ min: 10, max: 150 })
        .withMessage("email must be between 10 and 150 characters")
        .custom(async (value) => {
        const existingUser = await User.findOne({ "contact.email": value });
        if (existingUser) {
            throw new Error("email already in use");
        }
    }),
    body("password")
        .trim()
        .notEmpty()
        .withMessage("password is required")
        .isLength({ min: 8, max: 40 })
        .withMessage("password must be between 8 and 40 characters"),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
//# sourceMappingURL=signupValidator.js.map