/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import User from "../app/models/User.js";
import { UserRoles } from "../enums/UserRoles.js";
import { UserInterface } from "../interfaces/models/UserInterface.js";
import { HydratedDocument } from "mongoose";
import { PostTag } from "../enums/PostTag.js";
import bcrypt from "bcryptjs";

const EGYPTIAN_CITIES = [
    "Cairo",
    "Alexandria",
    "Giza",
    "Luxor",
    "Aswan",
    "Tanta",
    "Port Said",
];
const EGYPTIAN_STREETS = [
    "Heliopolis",
    "New Cairo",
];
const NUTRITION_SPECIALIZATIONS = [
    "General Nutritionist",
    "Sports Nutritionist",
    "Pediatric Dietitian",
    "Clinical Dietitian",
    "Weight Management Specialist",
    "Ketogenic Diet Specialist",
    "Diabetes Care Dietitian",
];
const DISEASES = [
    "Type 2 Diabetes",
    "Hypertension",
    "Obesity",
    "High Cholesterol",
    "None",
    "IBS (Irritable Bowel Syndrome)",
    "Thyroid Disorder",
];
const MEDICATIONS = ["Metformin 500mg", "Metformin 250mg"];

const DEFAULT_IMAGE = "profile/c1061faa750196d4e319f930e72215b5.jpeg";
const HASHED_PASSWORD = bcrypt.hashSync("12121212", 10);

const generateFakeUser = (role: UserRoles = UserRoles.USER): Partial<UserInterface> => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const isDoctor = role === UserRoles.DOCTOR;
    const city = faker.helpers.arrayElement(EGYPTIAN_CITIES);
    const street = faker.helpers.arrayElement(EGYPTIAN_STREETS);

    return {
        name: {
            first: firstName,
            last: lastName,
        },
        contact: {
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            phone: faker.string.numeric(11),
            address: { city, street },
        },
        password: HASHED_PASSWORD,
        isVerified: true,
        isActive: faker.datatype.boolean({ probability: 0.9 }),

        ...(isDoctor && {
            doctorInfo: {
                shortConsultPrice: faker.number.int({ min: 150, max: 400 }),
                normalConsultPrice: faker.number.int({ min: 400, max: 800 }),
                LongConsultPrice: faker.number.int({ min: 800, max: 1500 }),
                isCertified: true,
                frontIdImage: DEFAULT_IMAGE,
                backIdImage: DEFAULT_IMAGE,
                certImage: DEFAULT_IMAGE,
                specialization: faker.helpers.arrayElement(NUTRITION_SPECIALIZATIONS),
                experienceYears: faker.number.int({ min: 1, max: 20 }),
                workingDays: faker.helpers.arrayElements(
                    ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
                    { min: 3, max: 6 },
                ),
                workingHoursStart: faker.helpers.arrayElement(["08:00", "09:00", "10:00"]),
                workingHoursEnd: faker.helpers.arrayElement(["16:00", "17:00", "18:00"]),
                ratingAverage: parseFloat(faker.number.float({ min: 3.5, max: 5, fractionDigits: 1 }).toFixed(1)),
                totalReviews: faker.number.int({ min: 5, max: 200 }),
            },
        }),

        userInfo: {
            bio: faker.lorem.sentence({ min: 8, max: 15 }),
            job: isDoctor ? faker.helpers.arrayElement(NUTRITION_SPECIALIZATIONS) : faker.person.jobTitle(),
            age: faker.number.int({ min: 18, max: 65 }),
            weight: faker.number.int({ min: 45, max: 140 }),
            height: faker.number.int({ min: 155, max: 195 }),
            gender: faker.helpers.arrayElement(["male", "female"]),
            diseases: faker.helpers.arrayElement(DISEASES),
            medications: faker.helpers.arrayElement(MEDICATIONS),
            tags: faker.helpers.arrayElements(Object.values(PostTag), { min: 1, max: 3 }),
        },

        cardPayment: {
            number: faker.finance.creditCardNumber("visa").replace(/\D/g, ""),
            name: `${firstName} ${lastName}`,
            cvv: faker.finance.creditCardCVV(),
            expDate: faker.date.future({ years: 5 }).toLocaleDateString("en", { month: "2-digit", year: "2-digit" }),
        },

        role,
        image: DEFAULT_IMAGE,
        coverImage: DEFAULT_IMAGE,
        provider: "local",
    };
};

export const seedUsers = async (
    count: number = 30,
): Promise<{
    createdUsers: UserInterface[];
    authUser: HydratedDocument<UserInterface>;
}> => {
    try {
        // await User.deleteMany({});
        console.log("🗑️  Cleared existing users");

        const users: Partial<UserInterface>[] = [];

        // Normal users (seekers)
        for (let i = 0; i < count; i++) {
            users.push(generateFakeUser(UserRoles.USER));
        }

        // Doctor users
        for (let i = 0; i < 15; i++) {
            users.push(generateFakeUser(UserRoles.DOCTOR));
        }

        const firstName = faker.person.firstName();
        const lastName = faker.person.lastName();
        // ─── Test Accounts ──────────────────────────────────────────────
        // Test Doctor Account
        await User.create({
            name: { first: firstName, last: lastName },
            contact: {
                email: "doctor1@gmail.com",
                phone: "01012345678",
                address: {
                    city: faker.helpers.arrayElement(EGYPTIAN_CITIES),
                    street: faker.helpers.arrayElement(EGYPTIAN_STREETS),
                },
            },
            password: "12121212",
            isVerified: true,
            isActive: true,
            role: UserRoles.DOCTOR,
            image: DEFAULT_IMAGE,
            coverImage: DEFAULT_IMAGE,
            provider: "local",
            doctorInfo: {
                shortConsultPrice: 200,
                normalConsultPrice: 500,
                LongConsultPrice: 900,
                isCertified: true,
                frontIdImage: DEFAULT_IMAGE,
                backIdImage: DEFAULT_IMAGE,
                certImage: DEFAULT_IMAGE,
                specialization: "Clinical Dietitian",
                experienceYears: 8,
                workingDays: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday"],
                workingHoursStart: "09:00",
                workingHoursEnd: "17:00",
                ratingAverage: 4.8,
                totalReviews: 124,
            },
            userInfo: {
                bio: "Certified clinical dietitian with 8 years of experience in weight management and chronic disease nutrition.",
                job: "Clinical Dietitian",
                age: 35,
                weight: 80,
                height: 178,
                gender: "male",
                diseases: "None",
                medications: "None",
                tags: ["diabetes", "Weight Loss"],
            },
            cardPayment: {
                number: "4111111111111111",
                name: "Ahmed ali",
                cvv: "123",
                expDate: "12/27",
            },
        });

        // Test User (Seeker) — Primary auth user
        const authUser = await User.create({
            name: { first: "Mohamed", last: "Ali" },
            contact: {
                email: "user1@gmail.com",
                phone: "01155667788",
                address: { city: "Cairo", street: "el tahr street" },
            },
            password: "12121212",
            isVerified: true,
            isActive: true,
            role: UserRoles.USER,
            image: DEFAULT_IMAGE,
            coverImage: DEFAULT_IMAGE,
            provider: "local",
            userInfo: {
                bio: "Health-conscious individual on a journey to improve fitness and well-being through proper nutrition.",
                job: "Software Engineer",
                age: 28,
                weight: 85,
                height: 175,
                gender: "male",
                diseases: "Type 2 Diabetes",
                medications: "Metformin 500mg",
                tags: ["diabetes", "Weight Loss"],
            },
            cardPayment: {
                number: "4111111111111111",
                name: "Mohamed Ali",
                cvv: "789",
                expDate: "06/29",
            },
        });
        console.log("✅ Test User created: user@gmail.com / 12121212");

        // Bulk insert faker users
        const createdUsers = (await User.insertMany(users)) as UserInterface[];
        console.log(`✅ Successfully seeded ${createdUsers.length} additional users!`);

        return { createdUsers, authUser };
    } catch (err: unknown) {
        console.error("User seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
