/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import User from "../app/models/User.js";
import { UserRoles } from "../enums/UserRoles.js";

const seedDoctors = async (userIds: Types.ObjectId[]): Promise<Types.ObjectId[]> => {
    try {
        console.log("👨‍⚕️ Converting selected users to doctors...");

        for (const userId of userIds) {
            await User.findByIdAndUpdate(userId, {
                role: UserRoles.DOCTOR,
                doctorInfo: {
                    shortConsultPrice: faker.number.int({ min: 50, max: 150 }),
                    normalConsultPrice: faker.number.int({ min: 151, max: 300 }),
                    LongConsultPrice: faker.number.int({ min: 301, max: 600 }),
                    isCertified: faker.datatype.boolean(0.8), // 80% chances of being certified
                    frontIdImage: faker.image.url(),
                    backIdImage: faker.image.url(),
                    certImage: faker.image.url(),
                },
                "userInfo.bio": faker.lorem.paragraph(),
                "userInfo.job": "Medical Specialist",
            });
        }

        console.log(`✅ Successfully promoted ${userIds.length} users to doctors`);
        return userIds;
    } catch (err: unknown) {
        console.error("Doctor seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedDoctors;
