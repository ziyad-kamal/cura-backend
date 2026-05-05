/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import { ProductInterface } from "../interfaces/models/ProductInterface.ts";
import { Product } from "../app/models/Product.ts";

const seedProducts = async (
    count: number = 30,
    adminIds: Array<Types.ObjectId> = [],
    companiesIds: Array<Types.ObjectId> = [],
): Promise<ProductInterface[]> => {
    try {
        await Product.deleteMany({});
        console.log("🗑️  Cleared existing products");

        const products = [];
        const image = faker.image.urlPicsumPhotos({
            width: 800,
            height: 600,
        });

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });

            products.push({
                price:faker.number.int({min:100,max:5000}),
                description: faker.lorem.paragraph({ min: 2, max: 5 }),
                name: faker.lorem.word(8),
                images: [image, image],
                adminId: faker.helpers.arrayElement(adminIds),
                companyId: faker.helpers.arrayElement(companiesIds),
                tags: faker.helpers.arrayElements([" يزيد الوزن", " ينقص الوزن", "يحسن المناعة"],{min:1,max:3}),
                createdAt: randomDate,
            });
        }

        const createdProducts = await Product.insertMany(products);
        console.log(`✅ Created ${createdProducts.length} products`);

        return createdProducts;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedProducts;
