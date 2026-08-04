/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Message from '../app/models/Message.js';
const seedMessages = async (authId, userIds = [], chatroomIds) => {
    try {
        await Message.deleteMany({});
        console.log("🗑️  Cleared existing messages");
        const messages = [];
        const image = "public/posts/86381e92c4a401687272bdd2ddd157f5.png";
        for (const userId of userIds) {
            const randomDate = faker.date.past({ years: 1 });
            messages.push({
                content: faker.lorem.paragraph({ min: 2, max: 5 }),
                files: [
                    { s3Key: image, type: "image" },
                    { s3Key: image, type: "image" },
                ],
                chatroom: faker.helpers.arrayElement(chatroomIds),
                isRead: faker.datatype.boolean({ probability: 0.5 }),
                receiver: userId,
                sender: authId,
                createdAt: randomDate,
            });
        }
        const createdMessages = await Message.insertMany(messages);
        console.log(`✅ Created ${createdMessages.length} messages`);
        return createdMessages;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedMessages;
//# sourceMappingURL=messageSeeder.js.map