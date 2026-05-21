/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Transaction from '../app/models/Transaction.js';
import { Types } from "mongoose";

const seedTransactions = async (
    count: number = 30,
    orderIds: Array<Types.ObjectId> = [],
    consultationIds: Array<Types.ObjectId> = [],
): Promise<void> => {
    try {
        await Transaction.deleteMany({});
        console.log("🗑️  Cleared existing transactions");

        const transactions = [];

        for (let i = 0; i < count; i++) {
            transactions.push({
                bankTransactionId: faker.string.uuid,
                consultation: faker.helpers.arrayElement(consultationIds),
                order: faker.helpers.arrayElement(orderIds),
            });
        }

        const createdTransactions = await Transaction.insertMany(transactions);
        console.log(`✅ Created ${createdTransactions.length} transactions`);
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedTransactions;
