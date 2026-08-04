/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Admin from '../app/models/Admin.js';
const seedAdmins = async (count = 30) => {
    try {
        await Admin.deleteMany({});
        console.log("🗑️  Cleared existing admins");
        const admins = [];
        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            admins.push({
                name: faker.person.fullName(),
                email: faker.internet.email(),
                phone: Number(faker.string.numeric(11)), // Converted to Number
                password: '13131313',
                role: faker.helpers.arrayElement(["admin", "super admin", "company admin"]), // Added required role field
                createdAt: randomDate,
                updatedAt: randomDate,
            });
        }
        const created = await Admin.insertMany(admins);
        console.log(`✅ Created ${created.length} admins`);
        return created;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedAdmins;
//# sourceMappingURL=adminSeeder.js.map