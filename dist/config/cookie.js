import "dotenv/config";
import { appConfig } from './app.js';
export const cookieConfig = (maxAge) => {
    return {
        httpOnly: true,
        secure: appConfig.nodeEnv === "production",
        sameSite: "lax",
        maxAge: maxAge,
        path: "/",
    };
};
//# sourceMappingURL=cookie.js.map