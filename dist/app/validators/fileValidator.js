import { body, validationResult } from "express-validator";
import { returnError } from "../utils/returnJson.js";
import { FileType } from "../../enums/FileType.js";
export const fileValidator = [
    body("fileName")
        .trim()
        .notEmpty()
        .withMessage("file name is required")
        .isLength({ min: 3, max: 100 })
        .withMessage("file name must be between 3 and 100 characters long"),
    body("fileType")
        .trim()
        .notEmpty()
        .withMessage("file type is required")
        .isIn(Object.values(FileType))
        .withMessage(`file type must be one of the following: ${Object.values(FileType).join(", ")}`),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return returnError(res, "correct errors under each input", 422, errors);
        }
        next();
    },
];
//# sourceMappingURL=fileValidator.js.map