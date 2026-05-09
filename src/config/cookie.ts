import "dotenv/config";
import { CookieInterface } from '../interfaces/config/CookieInterface.js';
import { appConfig } from './app.js';

export const cookieConfig = (maxAge: number): CookieInterface => {
    return {
        httpOnly: true,
        secure: appConfig.nodeEnv === "production",
        sameSite: "lax",
        maxAge: maxAge,
        path: "/",
    };
};
