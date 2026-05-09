/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Chatroom from '../app/models/Chatroom.js';
import { Types } from "mongoose";
import { ChatroomInterface } from '../interfaces/models/ChatroomInterface.js';

const seedChatrooms = async (
    count: number = 30,
    userIds: Array<Types.ObjectId> = [],
    consultationIds: Array<Types.ObjectId> = [],
): Promise<ChatroomInterface[]> => {
    try {
        await Chatroom.deleteMany({});
        console.log("🗑️  Cleared existing chatrooms");

        const chatrooms = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });

            chatrooms.push({
                isActive: faker.datatype.boolean({ probability: 0.7 }),
                consultation: faker.helpers.arrayElement(consultationIds),
                receiver: faker.helpers.arrayElement(userIds),
                sender: faker.helpers.arrayElement(userIds),
                createdAt: randomDate,
            });
        }

        const createdChatrooms = await Chatroom.insertMany(chatrooms);
        console.log(`✅ Created ${createdChatrooms.length} chatrooms`);

        return createdChatrooms;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedChatrooms;
