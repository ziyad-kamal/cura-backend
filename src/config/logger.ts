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
        });
    });

    next();
};

const saveLogToDB = async (level: string, req: Request, res: Response, message: string) => {
    await Log.create({
        level,
        message,
        method: req.method,
        url: req.url,
        ...(level === "error" && { statusCode: res.statusCode }),
        ip: req.ip,
        userId: req.user?._id ?? null,
    });
};

export const log = {
    info: (req: Request, res: Response, msg: string) => {
        saveLogToDB("info", req, res, msg);
    },

    error: (req: Request, res: Response, msg: string = "", err?: unknown) => {
        const errorMessage = err instanceof Error ? err.message : typeof err === "string" ? err : msg;

        saveLogToDB("error", req, res, errorMessage);
    },

    warn: (req: Request, res: Response, msg: string) => {
        saveLogToDB("warn", req, res, msg);
    },

    debug: (req: Request, res: Response, msg: string) => {
        if (process.env.NODE_ENV !== "production") {
            saveLogToDB("debug", req, res, msg);
        }
    },
};
