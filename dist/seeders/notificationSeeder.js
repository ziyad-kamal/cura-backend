/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Notification from '../app/models/Notification.js';
const seedNotifications = async (count = 30, usersIds = [], postIds = []) => {
    try {
        await Notification.deleteMany({});
        console.log("🗑️  Cleared existing notifications");
        const notifications = [];
        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            const type = faker.helpers.arrayElement(["like", "comment", "message", "connection"]);
            const isPostType = type === "like" || type === "comment";
            notifications.push(Object.assign(Object.assign({ message: faker.lorem.paragraph({ min: 1, max: 1 }) }, (isPostType && { post: faker.helpers.arrayElement(postIds) })), { receiver: faker.helpers.arrayElement(usersIds), sender: faker.helpers.arrayElement(usersIds), createdAt: randomDate, isRead: faker.datatype.boolean({ probability: 0.7 }), type }));
        }
        const createdNotifications = await Notification.insertMany(notifications);
        console.log(`✅ Created ${createdNotifications.length} notifications`);
        return createdNotifications;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedNotifications;
//# sourceMappingURL=notificationSeeder.js.map