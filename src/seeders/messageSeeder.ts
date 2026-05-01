/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Message from "../app/models/Message.ts";
import { Types } from "mongoose";
import { MessageInterface } from "../interfaces/models/MessageInterface.ts";

const seedMessages = async (count: number = 30, adminIds: Array<Types.ObjectId> = []): Promise<MessageInterface[]> => {
    try {
        await Message.deleteMany({});
        console.log("🗑️  Cleared existing messages");

        const messages = [];
        const image = faker.image.urlPicsumPhotos({
            width: 800,
            height: 600,
        });
        
        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });

            messages.push({
                content: faker.lorem.paragraph({ min: 2, max: 5 }),
                files: [
                    { url: image, type: "image" },
                    { url: image, type: "image" },
                ],
                receiverId: faker.helpers.arrayElement(adminIds),
                senderId: faker.helpers.arrayElement(adminIds),
                createdAt: randomDate,
            });
        }

        const createdMessages = await Message.insertMany(messages);
        console.log(`✅ Created ${createdMessages.length} messages`);

        return createdMessages;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedMessages;
