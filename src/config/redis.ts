/* eslint-disable no-console */
import { createClient, RedisClientType } from "redis";

export let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
    if (redisClient?.isReady) return;

    redisClient = createClient({
        url: process.env.REDIS_URL,
    });

    redisClient.on("reconnecting", () => console.log("Redis reconnecting..."));

    try {
        await redisClient.connect();
        console.log("✅ Redis connected");
    } catch (error) {
        console.warn(`⚠️ Failed to connect to Redis at. Rate limiting will not work.`, error);
    }
};
