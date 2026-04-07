import { Request } from "express";
import rateLimit, { ipKeyGenerator } from "express-rate-limit";
import { RedisReply, RedisStore } from "rate-limit-redis";
import { redisClient } from "../../config/redis.ts";

let redisStore: RedisStore | null = null;

const getRedisStore = (): RedisStore | null => {
    if (!redisStore && redisClient?.isReady) {
        const sendCommand = async (...args: string[]): Promise<RedisReply> => {
            return redisClient.sendCommand(args);
        };
        redisStore = new RedisStore({ sendCommand });
    }
    return redisStore;
};

export const rateLimiter = ({ windowMs = 60 * 1000, limit = 45 } = {}) => {
    const store = getRedisStore();

    if (!store) {
        // eslint-disable-next-line no-console
        console.warn("⚠️ Redis not available. Rate limiting will use memory store.");
    }

    return rateLimit({
        ...(store && { store }),

        windowMs,
        limit,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        message: { success: false, msg: "Too many requests" },

        keyGenerator: (req: Request) => ipKeyGenerator(req.ip ?? "anonymous"),
    });
};
