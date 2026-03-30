import "dotenv/config";
import { StringValue } from "ms";

export const jwtConfig = {
    accessTokenSecret: process.env.ACCESS_TOKEN_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    accessExpireTime: process.env.ACCESS_EXPIRE_TIME as StringValue,
    refreshExpireTime: process.env.REFRESH_EXPIRE_TIME as StringValue,
};
