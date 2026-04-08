import "dotenv/config";
import { NextFunction, Request, Response } from "express";
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

// export const logger = pino({
//     level: process.env.NODE_ENV === "production" ? "info" : "debug",
//     transport:
//         process.env.NODE_ENV !== "production"
//             ? {
//                   target: "pino-pretty",
//                   options: {
//                       colorize: true,
//                       translateTime: "SYS:standard",
//                       ignore: "pid,hostname",
//                   },
//               }
//             : undefined,
// });
// Helper to save log to database (non-blocking)
const saveLogToDB = async (level: string, msg: string, data: any = {}) => {
    try {
        await Log.create({
            level,
            message: msg,
            userId: data.userId,
        });
    } catch (err) {
        console.error("Failed to save log to database:", err);
    }
};

// Wrap logger with DB saving
export const log = {
    info: (msg: string, data: any = {}) => {
        saveLogToDB("info", msg, data);
    },

    error: (msg: string, err?: any, data: any = {}) => {
        saveLogToDB("error", msg, { ...data, error: err?.message || err });
    },

    warn: (msg: string, data: any = {}) => {
        saveLogToDB("warn", msg, data);
    },

    debug: (msg: string, data: any = {}) => {
        if (process.env.NODE_ENV !== "production") {
            saveLogToDB("debug", msg, data);
        }
    },
};
