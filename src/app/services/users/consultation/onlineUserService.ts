import { redis } from "../../../../config/redis.js";

export const RedisService = {
    /**
     * Set user status to online with an expiration heartbeat (TTL)
     */
    setUserOnline: async (userId: string, ttlSeconds: number = 60): Promise<void> => {
        const key = `user:status:${userId}`;
        // "EX" sets an automatic expiration time so users don't get stuck "online" if servers crash
        await redis.set(key, "online", "EX", ttlSeconds);
    },

    /**
     * Manually set user status to offline
     */
    setUserOffline: async (userId: string): Promise<void> => {
        const key = `user:status:${userId}`;
        await redis.del(key);
    },

    /**
     * Check if a specific user is currently online
     */
    isUserOnline: async (userId: string): Promise<boolean> => {
        const key = `user:status:${userId}`;
        const status = await redis.get(key);
        return status === "online";
    },

    /**
     * Batch check online status for multiple users (Perfect for Chat Sidebars/Feeds)
     */
    getUsersOnlineStatus: async (userIds: string[]): Promise<Record<string, boolean>> => {
        if (!userIds.length) return {};

        const keys = userIds.map((id) => `user:status:${id}`);
        const results = await redis.mget(...keys); // mget fetches multiple keys in a single network round-trip

        const statusMap: Record<string, boolean> = {};
        userIds.forEach((id, index) => {
            statusMap[id] = results[index] === "online";
        });

        return statusMap;
    },
};
