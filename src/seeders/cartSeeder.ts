/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Cart from '../app/models/Cart.js';
import { Types } from "mongoose";
import { ProductInterface } from '../interfaces/models/ProductInterface.js';
import { HydratedDocument } from "mongoose";

const seedCarts = async (
    userIds: Array<Types.ObjectId> = [],
    products: HydratedDocument<ProductInterface>[] = [],
): Promise<void> => {
    try {
        // Drop the entire collection to ensure all old indexes are removed
        try {
            await Cart.collection.drop();
            console.log("🗑️  Cleared existing carts and their indexes");
        } catch (e: unknown) {
            // 'ns not found' error means the collection didn't exist, which is fine.
            if (e instanceof Error && e.message.includes('ns not found')) {
                console.log("🗑️  Carts collection not found, proceeding with creation.");
            } else {
                throw e; // Re-throw other errors
            }
        }

        const carts = [];

        // بما أن userId فريد (unique)، سنقوم بإنشاء سلة واحدة لكل مستخدم يتم تمريره
        for (const userId of userIds) {
            const selectedProducts = faker.helpers.arrayElements(products, { min: 1, max: 3 });
            
            const items = selectedProducts.map(product => ({
                productId: product._id,
                vendorId: product.vendorId,
                quantity: faker.number.int({ min: 1, max: 5 }),
                price: product.price
            }));

            const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

            carts.push({
                userId,
                items,
                totalPrice
            });
        }

        const createdCarts = await Cart.insertMany(carts);
        console.log(`✅ Created ${createdCarts.length} carts`);
    } catch (err: unknown) {
        console.error("Carts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedCarts;
