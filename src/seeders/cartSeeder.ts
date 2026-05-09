/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Cart from '../app/models/Cart.js';
import { Types } from "mongoose";
import { ProductInterface } from '../interfaces/models/ProductInterface.js';

const seedCarts = async (
    count: number = 30,
    userIds: Array<Types.ObjectId> = [],
    products: ProductInterface[] = [],
): Promise<void> => {
    try {
        await Cart.deleteMany({});
        console.log("🗑️  Cleared existing carts");

        const carts = [];

        for (let i = 0; i < count; i++) {
            carts.push({
                products: faker.helpers.arrayElements(products, { min: 2, max: 4 }),
                user: faker.helpers.arrayElement(userIds),
            });
        }

        const createdCarts = await Cart.insertMany(carts);
        console.log(`✅ Created ${createdCarts.length} carts`);
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedCarts;
