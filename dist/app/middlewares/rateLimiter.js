import { RateLimiterRedis } from "rate-limiter-flexible";
import { redis } from '../../config/redis.js';
const createLimiter = (points, duration) => {
    return new RateLimiterRedis({
        storeClient: redis,
        points,
        duration,
        keyPrefix: `rate-limit:${points}:${duration}`,
    });
};
// ─── Global Limiter ───────────────────────────────────────────
const globalLimiterInstance = createLimiter(45, 60);
export const globalLimiter = async (req, res, next) => {
    var _a;
    try {
        await globalLimiterInstance.consume((_a = req.ip) !== null && _a !== void 0 ? _a : "anonymous");
        next();
    }
    catch (_b) {
        res.status(429).json({
            success: false,
            msg: "Too many login attempts. Try again later.",
        });
    }
};
const routeLimiterInstance = createLimiter(3, 60);
export const routeLimiter = async (req, res, next) => {
    var _a;
    try {
        await routeLimiterInstance.consume((_a = req.ip) !== null && _a !== void 0 ? _a : "anonymous");
        next();
    }
    catch (_b) {
        res.status(429).json({
            success: false,
            msg: "Too many login attempts. Try again later.",
        });
    }
};
//# sourceMappingURL=rateLimiter.js.map