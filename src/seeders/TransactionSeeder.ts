/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Cart from '../app/models/Cart.js';
import { Types } from "mongoose";

const seedCarts = async (
    count: number = 30,
    orderIds: Array<Types.ObjectId> = [],
    consultationIds: Array<Types.ObjectId> = [],
): Promise<void> => {
    try {
        await Cart.deleteMany({});
        console.log("🗑️  Cleared existing transactions");

        const transactions = [];

        for (let i = 0; i < count; i++) {
            transactions.push({
                bankTransactionId: faker.string.uuid,
                consultationId: faker.helpers.arrayElement(consultationIds),
                orderId: faker.helpers.arrayElement(orderIds),
            });
        }

        const createdCarts = await Cart.insertMany(transactions);
        console.log(`✅ Created ${createdCarts.length} transactions`);
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedCarts;
