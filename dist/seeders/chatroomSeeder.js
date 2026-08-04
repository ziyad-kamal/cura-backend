/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Chatroom from "../app/models/Chatroom.js";
const seedChatrooms = async (count = 30, userIds = [], messageIds = [], consultationIds = [], authId) => {
    try {
        await Chatroom.deleteMany({});
        console.log("🗑️  Cleared existing chatrooms");
        const chatrooms = [];
        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            chatrooms.push(Object.assign(Object.assign({ isActive: faker.datatype.boolean({ probability: 0.7 }), consultation: faker.helpers.arrayElement(consultationIds), receiver: faker.helpers.arrayElement(userIds), lastMessageAt: randomDate, sender: authId, createdAt: randomDate }, (messageIds.length > 0 && { lastMessage: faker.helpers.arrayElement(messageIds) })), { activeUntil: faker.date.future({ years: 1 }) }));
        }
        const createdChatrooms = await Chatroom.insertMany(chatrooms);
        console.log(`✅ Created ${createdChatrooms.length} chatrooms`);
        return createdChatrooms;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedChatrooms;
//# sourceMappingURL=chatroomSeeder.js.map