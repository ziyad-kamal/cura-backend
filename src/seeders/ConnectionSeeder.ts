/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Connection from '../app/models/Connection.js';
import { ConnectionInterface } from '../interfaces/models/ConnectionInterface.js';

const seedConnections = async (
    count: number = 30,
    usersIds: Array<Types.ObjectId> = [],
): Promise<ConnectionInterface[]> => {
    try {
        await Connection.deleteMany({});
        console.log("🗑️  Cleared existing connections");

        const connections = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });

            connections.push({
                status: faker.helpers.arrayElement(["pending", "ignored", "accepted"]),
                receiver: faker.helpers.arrayElement(usersIds),
                sender: faker.helpers.arrayElement(usersIds),
                createdAt: randomDate,
                updatedAt: randomDate,
            });
        }

        const createdConnections = await Connection.insertMany(connections);
        console.log(`✅ Created ${createdConnections.length} connections`);

        return createdConnections as unknown as ConnectionInterface[];
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedConnections;
