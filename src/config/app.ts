import "dotenv/config";
import { AppInterface } from "../interfaces/config/AppInterface.ts";

export const appConfig: AppInterface = {
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || "development",
    apiPrefix: "/api",
    // frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
};
