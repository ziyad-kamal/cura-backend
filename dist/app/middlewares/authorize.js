import UnknownError from "../errors/UnknownError.js";
import { findRecord } from "../utils/findRecord.js";
export const authorize = (model, param, fields = ["user"]) => {
    return async (req, res, next) => {
        const id = req.params[param];
        const record = await findRecord(model, { _id: id });
        const authorized = fields.some((field) => { var _a, _b; return ((_a = record[field]) === null || _a === void 0 ? void 0 : _a.toString()) === ((_b = req.user) === null || _b === void 0 ? void 0 : _b._id); });
        if (!authorized) {
            throw new UnknownError();
        }
        next();
    };
};
//# sourceMappingURL=authorize.js.map