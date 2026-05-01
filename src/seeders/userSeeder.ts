/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { UserInterface } from "../interfaces/models/UserInterface.ts";
import User from "../app/models/User.ts";

const generateFakeUser = (role: "user" | "doctor" = "user"): Partial<UserInterface> => {
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
            phone: Number(faker.string.numeric(11)),
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
                isCertified: faker.datatype.boolean({ probability: 0.9 }),
                frontIdImage: image,
                backIdImage: image,
                certImage: image,
            },
        }),

        userInfo: {
            age: faker.number.int({ min: 18, max: 65 }).toString(),
            weight: Number(faker.string.numeric(2)),
            height: Number(faker.string.numeric(2)),
            gender: faker.helpers.arrayElement(["رجل", "انثى"]),
            diseases: faker.helpers.arrayElements(
                ["سكر", "ارتفاع ضغط الدم", "انخغاض ضغظ الدم"],
                faker.number.int({ min: 0, max: 3 }),
            ),
        },

        cardPayment: {
            number: parseInt(faker.finance.creditCardNumber("visa").replace(/\D/g, ""), 10),
            name: `${firstName} ${lastName}`,
            csv: parseInt(faker.finance.creditCardCVV(), 10),
            expDate: faker.date.future({ years: 5 }).toLocaleDateString("en", { month: "2-digit", year: "2-digit" }),
        },

        role: role,
        image: image,
    };
};

export const seedUsers = async (count: number = 20): Promise<Partial<UserInterface>[]> => {
    try {
        await User.deleteMany({});
        console.log("🗑️  Cleared existing users");

        const users: Partial<UserInterface>[] = [];

        for (let i = 0; i < Math.floor(count * 0.7); i++) {
            users.push(generateFakeUser("user"));
        }

        for (let i = 0; i < Math.floor(count * 0.3); i++) {
            users.push(generateFakeUser("doctor"));
        }

        const createdUsers = await User.insertMany(users);

        console.log(`✅ Successfully seeded ${createdUsers.length} users!`);

        return createdUsers;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
