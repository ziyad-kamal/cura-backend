/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Consultation from "../app/models/Consultation.ts";
import { ConsultationInterface } from "../interfaces/models/ConsultationInterface.ts";

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
                status: faker.helpers.arrayElement(["pending", "started", "in progress", "completed"]),
                userId: faker.helpers.arrayElement(userIds),
                doctorId: faker.helpers.arrayElement(userIds),
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
