import { Types } from "mongoose";
import { returnError } from "../utils/returnJson.js";
export const validateId = (param = '_id') => {
    return (req, res, next) => {
        const value = req.params[param];
        if (!Types.ObjectId.isValid(value)) {
            return returnError(res, `Invalid ${param}`, 422);
        }
        next();
    };
};
//# sourceMappingURL=validateId.js.map