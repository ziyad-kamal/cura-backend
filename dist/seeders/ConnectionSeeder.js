/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Connection from "../app/models/Connection.js";
const seedConnections = async (connectionCount = 20, usersIds = [], authUserId) => {
    try {
        await Connection.deleteMany({});
        console.log("🗑️  Cleared existing connections");
        const connections = [];
        const usedPairs = new Set();
        for (const userId of usersIds) {
            const randomDate = faker.date.past({ years: 1 });
            if (userId.toString() === authUserId.toString()) {
                continue;
            }
            const authIsSender = faker.datatype.boolean();
            connections.push({
                status: faker.helpers.arrayElement(['accepted', 'ignored', 'pending']),
                sender: authIsSender ? authUserId : userId,
                receiver: authIsSender ? userId : authUserId,
                createdAt: randomDate,
                updatedAt: randomDate,
            });
        }
        for (const userId of usersIds) {
            let createdConnections = 0;
            while (createdConnections < connectionCount) {
                const receiver = faker.helpers.arrayElement(usersIds);
                // prevent self connection
                if (receiver.toString() === userId.toString()) {
                    continue;
                }
                // prevent duplicate and reverse duplicate
                const ids = [userId.toString(), receiver.toString()].sort();
                const pairKey = `${ids[0]}-${ids[1]}`;
                if (usedPairs.has(pairKey)) {
                    continue;
                }
                usedPairs.add(pairKey);
                const randomDate = faker.date.past({ years: 1 });
                connections.push({
                    status: faker.helpers.arrayElement(["accepted", "pending", "ignored"]),
                    sender: userId,
                    receiver,
                    createdAt: randomDate,
                    updatedAt: randomDate,
                });
                createdConnections++;
            }
        }
        const createdConnections = await Connection.insertMany(connections);
        console.log(`✅ Created ${createdConnections.length} connections`);
        return createdConnections;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedConnections;
//# sourceMappingURL=ConnectionSeeder.js.map