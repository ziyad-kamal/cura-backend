import "dotenv/config";
export const appConfig = {
    port: process.env.PORT || 3000,
    appUrl: process.env.APP_URL || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
    apiPrefix: "/api",
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
    appName: process.env.APP_NAME || "cura",
};
//# sourceMappingURL=app.js.map