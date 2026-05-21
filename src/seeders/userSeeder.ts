/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import User from '../app/models/User.js';
import { UserRoles } from '../enums/UserRoles.js';
import { UserInterface } from '../interfaces/models/UserInterface.js';
import { HydratedDocument } from "mongoose";
import { PostTag } from "../enums/PostTag.js";

const generateFakeUser = (role: UserRoles = UserRoles.USER): Partial<UserInterface> => {
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const isDoctor = role === "doctor";
    const image = faker.image.urlPicsumPhotos({
        width: 800,
        height: 600,
    });

    return {
        name: {
            first: firstName,
            last: lastName,
        },
        contact: {
            email: faker.internet.email({ firstName, lastName }).toLowerCase(),
            phone: faker.string.numeric(11),
            address: {
                city: faker.location.city(),
                street: faker.location.streetAddress(),
            },
        },
        password: "13131313",
        isVerified: faker.datatype.boolean({ probability: 0.6 }),
        isActive: faker.datatype.boolean({ probability: 0.9 }),

        ...(isDoctor && {
            doctorInfo: {
                shortConsultPrice: faker.number.int({ min: 300, max: 700 }),
                normalConsultPrice: faker.number.int({ min: 700, max: 1000 }),
                LongConsultPrice: faker.number.int({ min: 1000, max: 1500 }),
                isCertified: faker.datatype.boolean({ probability: 0.9 }),
                frontIdImage: image,
                backIdImage: image,
                certImage: image,
            },
        }),

        userInfo: {
            age: faker.number.int({ min: 18, max: 65 }),
            weight: faker.number.int({ min: 40, max: 150 }), // More realistic weight
            height: faker.number.int({ min: 150, max: 200 }), // More realistic height
            gender: faker.helpers.arrayElement(["male", "female"]),
            diseases: "Diabetes and High Blood Pressure",
            medications:"Metformin and augmentin",
            tags: faker.helpers.arrayElements(Object.values(PostTag), { min: 1, max: 2 }),
        },

        cardPayment: {
            number: faker.finance.creditCardNumber("visa").replace(/\D/g, ""),
            name: `${firstName} ${lastName}`,
            cvv: faker.finance.creditCardCVV(),
            expDate: faker.date.future({ years: 5 }).toLocaleDateString("en", { month: "2-digit", year: "2-digit" }),
        },

        role: role,
        image: image,
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

        for (let i = 0; i < count; i++) {
            users.push(generateFakeUser(UserRoles.USER));
        }

        for (let i = 0; i < 10; i++) {
            users.push(generateFakeUser(UserRoles.DOCTOR));
        }

        const authUser = await User.create({
            name: {
                first: faker.person.firstName(),
                last: faker.person.lastName(),
            },
            contact: {
                email: "user@gmail.com",
            },
            userInfo: {
                age: faker.number.int({ min: 18, max: 65 }),
                weight: Number(faker.string.numeric(2)),
                height: Number(faker.string.numeric(2)),    
                diseases: "Diabetes and High Blood Pressure",
                medications:"Metformin and augmentin",
                tags: ["diabetes", "hypertension"],
            },
            password: "12121212",
            role: UserRoles.USER,
            image: faker.image.urlPicsumPhotos({
                width: 400,
                height: 300,
            }),
        });

        await User.create({
            name: {
                first: faker.person.firstName(),
                last: faker.person.lastName(),
            },
            contact: {
                email: "doctor@gmail.com",
            },
            password: "12121212",
            role: UserRoles.DOCTOR,
            image: faker.image.urlPicsumPhotos({
                width: 400,
                height: 300,
            }),
        });

        const createdUsers  = await User.insertMany(users) as UserInterface[];

        console.log(`✅ Successfully seeded ${createdUsers.length} users!`);

        return { createdUsers, authUser };
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
