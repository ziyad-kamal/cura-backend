import { findRecord } from "../utils/findRecord.js";
import User from "../models/User.js";
import { returnError } from "../utils/returnJson.js";
export const isVerified = () => {
    return async (req, res, next) => {
        const user = await findRecord(User, { _id: req.user._id });
        if (user.isVerified !== true) {
            returnError(res, 'you should verify your email before doing this action', 401);
        }
        next();
    };
};
//# sourceMappingURL=isVerified.js.map