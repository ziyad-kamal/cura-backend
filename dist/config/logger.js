import "dotenv/config";
import { Log } from '../app/models/Log.js';
export const httpLogger = (req, res, next) => {
    const start = process.hrtime.bigint();
    res.on("finish", () => {
        var _a, _b;
        const responseTimeMs = Number((process.hrtime.bigint() - start) / BigInt(1000000));
        Log.create({
            level: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: responseTimeMs,
            ip: req.ip,
            userId: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) !== null && _b !== void 0 ? _b : null,
        });
    });
    next();
};
const saveLogToDB = async (level, req, res, message) => {
    var _a, _b;
    await Log.create(Object.assign(Object.assign({ level,
        message, method: req.method, url: req.url }, (level === "error" && { statusCode: res.statusCode })), { ip: req.ip, userId: (_b = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id) !== null && _b !== void 0 ? _b : null }));
};
export const log = {
    info: (req, res, msg) => {
        saveLogToDB("info", req, res, msg);
    },
    error: (req, res, msg = "", err) => {
        const errorMessage = err instanceof Error ? err.message : typeof err === "string" ? err : msg;
        saveLogToDB("error", req, res, errorMessage);
    },
    warn: (req, res, msg) => {
        saveLogToDB("warn", req, res, msg);
    },
    debug: (req, res, msg) => {
        if (process.env.NODE_ENV !== "production") {
            saveLogToDB("debug", req, res, msg);
        }
    },
};
//# sourceMappingURL=logger.js.map