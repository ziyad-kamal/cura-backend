import { UserRoles } from "../../enums/UserRoles.js";
import { returnError } from "../utils/returnJson.js";
import Vendor from "../models/Vendor.js";
export const requireRole = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return returnError(res, "Unauthorized", 401);
        }
        if (!roles.includes(req.user.role)) {
            return returnError(res, "Forbidden: Access denied", 403);
        }
        next();
    };
};
export const requireVendorOwnership = async (req, res, next) => {
    if (!req.user) {
        return returnError(res, "Unauthorized", 401);
    }
    if (req.user.role !== UserRoles.VENDOR) {
        return returnError(res, "Forbidden: Not a vendor", 403);
    }
    try {
        const vendor = await Vendor.findOne({ userId: req.user._id });
        if (!vendor) {
            return returnError(res, "Vendor profile not found", 404);
        }
        // Attach vendor to req object for convenience in downstream handlers
        req.vendor = vendor;
        next();
    }
    catch (error) {
        return returnError(res, "Server error validating vendor ownership", 500);
    }
};
//# sourceMappingURL=roleGuard.js.map