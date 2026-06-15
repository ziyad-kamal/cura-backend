/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Chatroom from "../app/models/Chatroom.js";
import { Types } from "mongoose";
import { ChatroomInterface } from "../interfaces/models/ChatroomInterface.js";

const seedChatrooms = async (
    count: number = 30,
    userIds: Array<Types.ObjectId> = [],
    messageIds: Array<Types.ObjectId> = [],
    consultationIds: Array<Types.ObjectId> = [],
    authId?: Types.ObjectId,
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
                lastMessageAt:randomDate,
                sender: authId ,
                createdAt: randomDate,
                ...(messageIds.length > 0 && { lastMessage: faker.helpers.arrayElement(messageIds) }),
                activeUntil: faker.date.future({ years: 1 }),
            });
        }

        const createdChatrooms = await Chatroom.insertMany(chatrooms);
        console.log(`✅ Created ${createdChatrooms.length} chatrooms`);

        return createdChatrooms as unknown as ChatroomInterface[];
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedChatrooms;
