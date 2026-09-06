/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import User from "../app/models/User.js";
import { UserRoles } from "../enums/UserRoles.js";

const NUTRITION_SPECIALIZATIONS = [
    "General Nutritionist",
    "Sports Nutritionist",
    "Pediatric Dietitian",
    "Clinical Dietitian",
    "Weight Management Specialist",
    "Ketogenic Diet Specialist",
    "Diabetes Care Dietitian",
];

const DEFAULT_IMAGE =
    "public/profile/edf244e9118f2073098513fb3cbf4613.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=AKIAUJDJ4NI64QF6PT63%2F20260906%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20260906T094911Z&X-Amz-Expires=3600&X-Amz-Signature=3702954871950f82f238ad97a3dfdb3d4d33ddd6a4874fe95d3c22708332349d&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject";
const seedDoctors = async (userIds: Types.ObjectId[]): Promise<Types.ObjectId[]> => {
    try {
        console.log("👨‍⚕️ Converting selected users to doctors...");

        for (const userId of userIds) {
            const specialization = faker.helpers.arrayElement(NUTRITION_SPECIALIZATIONS);
            const experienceYears = faker.number.int({ min: 1, max: 20 });

            await User.findByIdAndUpdate(userId, {
                role: UserRoles.DOCTOR,
                doctorInfo: {
                    shortConsultPrice: faker.number.int({ min: 150, max: 400 }),
                    normalConsultPrice: faker.number.int({ min: 400, max: 800 }),
                    LongConsultPrice: faker.number.int({ min: 800, max: 1500 }),
                    isCertified: faker.datatype.boolean({ probability: 0.85 }),
                    frontIdImage: DEFAULT_IMAGE,
                    backIdImage: DEFAULT_IMAGE,
                    certImage: DEFAULT_IMAGE,
                    specialization,
                    experienceYears,
                    workingDays: faker.helpers.arrayElements(
                        ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                        { min: 3, max: 6 }
                    ),
                    workingHoursStart: faker.helpers.arrayElement(["08:00", "09:00", "10:00"]),
                    workingHoursEnd: faker.helpers.arrayElement(["16:00", "17:00", "18:00"]),
                    ratingAverage: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
                    totalReviews: faker.number.int({ min: 5, max: 200 }),
                },
                "userInfo.bio": `Experienced ${specialization} with ${experienceYears} years of clinical practice. ${faker.lorem.sentence()}`,
                "userInfo.job": specialization,
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
