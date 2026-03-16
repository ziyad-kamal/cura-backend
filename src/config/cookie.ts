import "dotenv/config";
import { CookieInterface } from "../interfaces/config/CookieInterface.ts";
import { appConfig } from "./app.ts";

export const cookieConfig = (maxAge: number): CookieInterface => {
    return {
        httpOnly: true,
        secure: appConfig.nodeEnv === "production",
        sameSite: "lax",
        maxAge: maxAge,
        path: "/",
    };
};
