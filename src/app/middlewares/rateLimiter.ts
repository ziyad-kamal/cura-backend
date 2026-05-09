import { NextFunction, Request, Response } from "express";
import { RateLimiterRedis } from "rate-limiter-flexible";
import {redis} from '../../config/redis.js';

const createLimiter = (points: number, duration: number) => {
    return new RateLimiterRedis({
        storeClient: redis,
        points,
        duration,
        keyPrefix: `rate-limit:${points}:${duration}`,
    });
};

// ─── Global Limiter ───────────────────────────────────────────
const globalLimiterInstance = createLimiter(45, 60); 

export const globalLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await globalLimiterInstance.consume(req.ip ?? "anonymous");
        next();
    } catch {
        res.status(429).json({
            success: false,
            msg: "Too many login attempts. Try again later.",
        });
    }
};

const routeLimiterInstance = createLimiter(3, 60); 

export const routeLimiter = async (req: Request, res: Response, next: NextFunction) => {
    try {
        await routeLimiterInstance.consume(req.ip ?? "anonymous");
        next();
    } catch {
        res.status(429).json({
            success: false,
            msg: "Too many login attempts. Try again later.",
        });
    }
};
