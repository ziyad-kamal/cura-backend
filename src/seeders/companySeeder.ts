/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Company from '../app/models/Company.js';
import { Types } from "mongoose";
import { CompanyInterface } from '../interfaces/models/CompanyInterface.js';

const seedCompanies = async (count: number = 30, adminIds: Array<Types.ObjectId> = []): Promise<CompanyInterface[]> => {
    try {
        await Company.deleteMany({});
        console.log("🗑️  Cleared existing companies");

        const companies = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });

            companies.push({
                name: faker.person.fullName(),
                image: faker.image.urlPicsumPhotos({
                    width: 800,
                    height: 600,
                }),
                admin: faker.helpers.arrayElement(adminIds),
                createdAt: randomDate,
            });
        }

        const createdCompanies = await Company.insertMany(companies);
        console.log(`✅ Created ${createdCompanies.length} companies`);

        return createdCompanies;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedCompanies;
