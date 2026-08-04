/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Order from '../app/models/Order.js';
const seedOrders = async (count = 30, userIds = [], products = []) => {
    try {
        await Order.deleteMany({});
        console.log("🗑️  Cleared existing orders");
        const orders = [];
        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            const selectedProducts = faker.helpers.arrayElements(products, { min: 2, max: 3 });
            const orderItems = selectedProducts.map((product) => ({
                product: product._id,
                amount: faker.number.int({ min: 1, max: 3 }),
            }));
            orders.push({
                userId: faker.helpers.arrayElement(userIds),
                totalPrice: faker.number.int({ min: 500, max: 5000 }),
                shippingAddress: {
                    city: faker.location.city(),
                    street: faker.location.street(),
                    name: faker.person.fullName(),
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                },
                orderStatus: faker.helpers.arrayElement(["pending", "confirmed", "shipped", "delivered", "cancelled"]),
                paymentStatus: faker.helpers.arrayElement(["pending", "paid", "failed"]),
                createdAt: randomDate,
            });
        }
        const createdOrders = await Order.insertMany(orders);
        console.log(`✅ Created ${createdOrders.length} orders`);
        return createdOrders;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedOrders;
//# sourceMappingURL=OrderSeeder.js.map