/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import TreatmentPlan from '../app/models/TreatmentPlan.js';
const seedTreatmentPlans = async (count = 30, adminIds = [], doctorsIds = [], consultationIds = []) => {
    try {
        await TreatmentPlan.deleteMany({});
        console.log("🗑️  Cleared existing treatmentPlans");
        const treatmentPlans = [];
        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            treatmentPlans.push({
                description: faker.lorem.paragraph({ min: 2, max: 5 }), // Good length
                diagnosis: faker.lorem.sentence({ min: 5, max: 10 }), // More realistic diagnosis length
                medications: "Paracetamol and Augmentin",
                procedures: "Stomach removal surgery and stomach wash surgery and liposuction",
                user: faker.helpers.arrayElement(adminIds),
                doctor: faker.helpers.arrayElement(doctorsIds),
                consultation: faker.helpers.arrayElement(consultationIds), // Added required consultation field
                tags: faker.helpers.arrayElements(["Increases Weight", " Decreases Weight", " Boosts Immunity"], {
                    min: 1,
                    max: 3,
                }),
                createdAt: randomDate, // Corrected type to Date
                updatedAt: randomDate, // Corrected type to Date
            });
        }
        const createdTreatmentPlans = await TreatmentPlan.insertMany(treatmentPlans);
        console.log(`✅ Created ${createdTreatmentPlans.length} treatmentPlans`);
        return createdTreatmentPlans;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedTreatmentPlans;
//# sourceMappingURL=treatmentPlanSeeder.js.map