import { cookieConfig } from '../../config/cookie.js';
export const attachHelpers = (req, res, next) => {
    res.cookieHelper = (name, value, maxAge) => {
        return res.cookie(name, value, cookieConfig(maxAge));
    };
    next();
};
//# sourceMappingURL=helpers.js.map