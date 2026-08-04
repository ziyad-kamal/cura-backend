import jwt from "jsonwebtoken";
import { jwtConfig } from '../../config/jwt.js';
export const sendToken = (userData, res) => {
    const accessToken = jwt.sign(userData, jwtConfig.accessTokenSecret, {
        expiresIn: jwtConfig.accessExpireTime,
    });
    const refreshToken = jwt.sign(userData, jwtConfig.refreshTokenSecret, {
        expiresIn: jwtConfig.refreshExpireTime,
    });
    // const cookieExpire = 24 * 60 * 60 * 1000;
    // res.cookieHelper("accessToken", accessToken, cookieExpire);
    // res.cookieHelper("refreshToken", refreshToken, cookieExpire);
    return { refreshToken, accessToken };
};
//# sourceMappingURL=sendToken.js.map