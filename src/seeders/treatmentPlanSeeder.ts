/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import TreatmentPlan from '../app/models/TreatmentPlan.js';
import { TreatmentPlanInterface } from '../interfaces/models/TreatmentPlanInterface.js';

const seedTreatmentPlans = async (
    count: number = 30,
    adminIds: Array<Types.ObjectId> = [],
    doctorsIds: Array<Types.ObjectId> = [],
): Promise<TreatmentPlanInterface[]> => {
    try {
        await TreatmentPlan.deleteMany({});
        console.log("🗑️  Cleared existing treatmentPlans");

        const treatmentPlans = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });

            treatmentPlans.push({
                description: faker.lorem.paragraph({ min: 2, max: 5 }),
                diagnosis: faker.lorem.word(8),
                medications: "Paracetamol and Augmentin",
                procedures: "Stomach removal surgery and stomach wash surgery and liposuction",
                user: faker.helpers.arrayElement(adminIds),
                doctor: faker.helpers.arrayElement(doctorsIds),
                tags: faker.helpers.arrayElements(["Increases Weight", " Decreases Weight", " Boosts Immunity"], {
                    min: 1,
                    max: 3,
                }),
                createdAt: randomDate,
            });
        }

        const createdTreatmentPlans = await TreatmentPlan.insertMany(treatmentPlans);
        console.log(`✅ Created ${createdTreatmentPlans.length} treatmentPlans`);

        return createdTreatmentPlans;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedTreatmentPlans;
