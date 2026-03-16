import "dotenv/config";
import { JwtInterface } from "../interfaces/config/JwtInterface.ts";

export const jwtConfig: JwtInterface = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET,
    accessExpireTime: process.env.ACCESS_EXPIRE_TIME,
    refreshExpireTime: process.env.REFRESH_EXPIRE_TIME,
};
