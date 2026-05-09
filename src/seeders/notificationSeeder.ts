/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Notification from '../app/models/Notification.js';
import { NotificationInterface } from '../interfaces/models/NotificationsInterface.js';

const seedNotifications = async (
    count: number = 30,
    usersIds: Array<Types.ObjectId> = [],
    postIds: Array<Types.ObjectId> = [],
): Promise<NotificationInterface[]> => {
    try {
        await Notification.deleteMany({});
        console.log("🗑️  Cleared existing notifications");

        const notifications = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            const type = faker.helpers.arrayElement(["like", "comment", "message", "connection"]);
            const isPostType = type === "like" || type === "comment";

            notifications.push({
                message: faker.lorem.paragraph({ min: 1, max: 1}),
                ...(isPostType && { postId: faker.helpers.arrayElement(postIds) }),
                receiverId: faker.helpers.arrayElement(usersIds),
                senderId: faker.helpers.arrayElement(usersIds),
                createdAt: randomDate,
            });
        }

        const createdNotifications = await Notification.insertMany(notifications);
        console.log(`✅ Created ${createdNotifications.length} notifications`);

        return createdNotifications;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedNotifications;
