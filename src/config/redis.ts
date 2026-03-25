/* eslint-disable no-console */
import "dotenv/config";
import { createClient, RedisClientType } from "redis";

const redisClient: RedisClientType = createClient({
    url: process.env.REDIS_URL,
    // password: process.env.REDIS_PASSWORD,
});

redisClient.on("error", (err) => {
    console.error("Redis Client Error:", err);
});

redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
    } catch (error) {
        console.error("Failed to connect to Redis:", error);
        process.exit(1);
    }
};

export { connectRedis, redisClient };
