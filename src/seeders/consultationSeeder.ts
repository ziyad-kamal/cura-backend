/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Consultation from '../app/models/Consultation.js';
import { ConsultationInterface } from '../interfaces/models/ConsultationInterface.js';

const seedConsultations = async (
    count: number = 30,
    userIds: Array<Types.ObjectId> = [],
): Promise<ConsultationInterface[]> => {
    try {
        await Consultation.deleteMany({});
        console.log("🗑️  Cleared existing consultations");

        const consultations = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });

            consultations.push({
                price: faker.number.int({ min: 300, max: 1000 }),
                type: faker.helpers.arrayElement(["short term", "medium term", "long term"]), // Added missing 'type' field
                status: faker.helpers.arrayElement(["pending", "started", "in progress", "completed"]),
                user: faker.helpers.arrayElement(userIds),
                doctor: faker.helpers.arrayElement(userIds),
                createdAt: randomDate,
            });
        }

        const createdConsultations = await Consultation.insertMany(consultations);
        console.log(`✅ Created ${createdConsultations.length} consultations`);

        return createdConsultations;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedConsultations;
