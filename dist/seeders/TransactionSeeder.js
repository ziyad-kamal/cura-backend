/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Transaction from '../app/models/Transaction.js';
const seedTransactions = async (count = 30, orderIds = [], consultationIds = []) => {
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
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedTransactions;
//# sourceMappingURL=TransactionSeeder.js.map