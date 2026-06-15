/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import User from "../app/models/User.js";
import { UserRoles } from "../enums/UserRoles.js";
import { UserInterface } from "../interfaces/models/UserInterface.js";
import { HydratedDocument } from "mongoose";
import { PostTag } from "../enums/PostTag.js";
import bcrypt from "bcryptjs";

const EGYPTIAN_CITIES = ["Cairo", "Alexandria", "Giza", "Luxor", "Aswan", "Hurghada", "Sharm El Sheikh", "Mansoura", "Tanta", "Port Said"];
const EGYPTIAN_STREETS = ["Tahrir Square", "El-Galaa St", "Salah Salem", "El-Haram St", "Mohandessin", "Zamalek", "Maadi", "Heliopolis", "Nasr City", "New Cairo"];
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
const MEDICATIONS = [
  "Metformin 500mg",
  "Amlodipine 5mg",
  "None",
  "Atorvastatin 20mg",
  "Levothyroxine 50mcg",
  "Omeprazole 20mg",
];

const DEFAULT_IMAGE = "public/posts/86381e92c4a401687272bdd2ddd157f5.png";
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
                    { min: 3, max: 6 }
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
        await User.deleteMany({});
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

        // ─── Test Accounts ──────────────────────────────────────────────
        // Test Doctor Account
        await User.create({
            name: { first: "Ahmed", last: "Hassan" },
            contact: {
                email: "doctor@gmail.com",
                phone: "01012345678",
                address: { city: "Cairo", street: "Nasr City, Abbas El-Akkad St" },
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
                name: "Ahmed Hassan",
                cvv: "123",
                expDate: "12/27",
            },
        });
        console.log("✅ Test Doctor created: doctor@gmail.com / 12121212");

        // Test Doctor 2
        await User.create({
            name: { first: "Sara", last: "Mostafa" },
            contact: {
                email: "doctor2@gmail.com",
                phone: "01098765432",
                address: { city: "Alexandria", street: "Stanley Beach St" },
            },
            password: "12121212",
            isVerified: true,
            isActive: true,
            role: UserRoles.DOCTOR,
            image: DEFAULT_IMAGE,
            coverImage: DEFAULT_IMAGE,
            provider: "local",
            doctorInfo: {
                shortConsultPrice: 180,
                normalConsultPrice: 450,
                LongConsultPrice: 850,
                isCertified: true,
                frontIdImage: DEFAULT_IMAGE,
                backIdImage: DEFAULT_IMAGE,
                certImage: DEFAULT_IMAGE,
                specialization: "Sports Nutritionist",
                experienceYears: 5,
                workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                workingHoursStart: "10:00",
                workingHoursEnd: "18:00",
                ratingAverage: 4.6,
                totalReviews: 87,
            },
            userInfo: {
                bio: "Sports nutritionist specializing in athletic performance, body composition, and recovery nutrition.",
                job: "Sports Nutritionist",
                age: 30,
                weight: 60,
                height: 165,
                gender: "female",
                diseases: "None",
                medications: "None",
                tags: ["Muscle Gain", "Weight Loss"],
            },
            cardPayment: {
                number: "4111111111111111",
                name: "Sara Mostafa",
                cvv: "456",
                expDate: "08/28",
            },
        });
        console.log("✅ Test Doctor 2 created: doctor2@gmail.com / 12121212");

        // Test User (Seeker) — Primary auth user
        const authUser = await User.create({
            name: { first: "Mohamed", last: "Ali" },
            contact: {
                email: "user@gmail.com",
                phone: "01155667788",
                address: { city: "Cairo", street: "Maadi, Road 9" },
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

        // Test User 2
        await User.create({
            name: { first: "Nour", last: "Ibrahim" },
            contact: {
                email: "user2@gmail.com",
                phone: "01222334455",
                address: { city: "Giza", street: "Mohandessin, Gameat El Dowal St" },
            },
            password: "12121212",
            isVerified: true,
            isActive: true,
            role: UserRoles.USER,
            image: DEFAULT_IMAGE,
            coverImage: DEFAULT_IMAGE,
            provider: "local",
            userInfo: {
                bio: "Passionate about healthy eating and sustainable lifestyle changes. Working with my nutritionist to reach my goals.",
                job: "Marketing Manager",
                age: 25,
                weight: 65,
                height: 162,
                gender: "female",
                diseases: "None",
                medications: "None",
                tags: ["Weight Loss", "Muscle Gain"],
            },
            cardPayment: {
                number: "4111111111111111",
                name: "Nour Ibrahim",
                cvv: "321",
                expDate: "03/30",
            },
        });
        console.log("✅ Test User 2 created: user2@gmail.com / 12121212");

        // Bulk insert faker users
        const createdUsers = (await User.insertMany(users)) as UserInterface[];
        console.log(`✅ Successfully seeded ${createdUsers.length} additional users!`);

        return { createdUsers, authUser };
    } catch (err: unknown) {
        console.error("User seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
