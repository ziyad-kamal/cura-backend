/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Company from '../app/models/Company.js';
const seedCompanies = async (count = 30, adminIds = []) => {
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
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedCompanies;
//# sourceMappingURL=companySeeder.js.map