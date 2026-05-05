/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Order from "../app/models/Order.ts";
import { Types } from "mongoose";
import { ProductInterface } from "../interfaces/models/ProductInterface.ts";
import { OrderInterface } from "../interfaces/models/OrderInterface.ts";

const seedOrders = async (
    count: number = 30,
    userIds: Array<Types.ObjectId> = [],
    products: ProductInterface[] = [],
): Promise<OrderInterface[]> => {
    try {
        await Order.deleteMany({});
        console.log("🗑️  Cleared existing orders");

        const orders = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            const selectedProducts = faker.helpers.arrayElements(products, { min: 2, max: 3 });

            const orderItems = selectedProducts.map((product) => ({
                productId: product._id,
                amount: faker.number.int({ min: 1, max: 3 }),
            }));

            orders.push({
                totalPrice: faker.number.int({ min: 1000, max: 5000 }),
                city: faker.location.city(),
                street: faker.location.street(),
                status: faker.helpers.arrayElement(["معلق", "تم الشحن", "في الطريق", "تم التوصيل", "تم الالغاء"]),
                userId: faker.helpers.arrayElement(userIds),
                products: orderItems,
                createdAt: randomDate,
            });
        }

        const createdOrders = await Order.insertMany(orders);
        console.log(`✅ Created ${createdOrders.length} orders`);

        return createdOrders as OrderInterface[];
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedOrders;
