import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import pino from "pino";
import { Log } from "../app/models/Log.ts";

export const httpLogger = (req: Request, res: Response, next: NextFunction) => {
    const start = process.hrtime.bigint();

    res.on("finish", () => {
        const responseTimeMs = Number((process.hrtime.bigint() - start) / BigInt(1_000_000));

        Log.create({
            level: res.statusCode >= 500 ? "error" : res.statusCode >= 400 ? "warn" : "info",
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            responseTime: responseTimeMs,
            ip: req.ip,
            userId: req.user?._id ?? null,
            // eslint-disable-next-line no-console
        }).catch((err) => console.error("Failed to save log:", err));
    });

    next();
};

export const logger = pino({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    transport:
        process.env.NODE_ENV !== "production"
            ? {
                  target: "pino-pretty",
                  options: {
                      colorize: true,
                      translateTime: "SYS:standard",
                      ignore: "pid,hostname",
                  },
              }
            : undefined,
});
