/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Connection from "../app/models/Connection.js";
import { ConnectionInterface } from "../interfaces/models/ConnectionInterface.js";

const seedConnections = async (
    connectionCount: number = 20,
    usersIds: Array<Types.ObjectId> = [],
): Promise<ConnectionInterface[]> => {
    try {
        await Connection.deleteMany({});
        console.log("🗑️  Cleared existing connections");

        const connections = [];
        const usedPairs = new Set();

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
                    status: faker.helpers.arrayElement([ "accepted"]),
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

        return createdConnections as unknown as ConnectionInterface[];
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedConnections;
