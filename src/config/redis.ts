/* eslint-disable no-console */
import {Redis} from "ioredis";
import "dotenv/config";

export const redis = new Redis({
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null, 
});

export const connectRedis = async () => {
    try {
        await redis.ping();

        console.log("✅ Redis connected");
    } catch (error) {
        console.error("❌ Redis failed", error);
    }
};
