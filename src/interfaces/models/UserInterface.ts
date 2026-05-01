import { Types } from "mongoose";

export interface UserInterface {
    _id?: Types.ObjectId;

    name: {
        first: string;
        last: string;
    };

    contact: {
        email: string;
        phone?: number;
        address?: {
            city: string;
            street: string;
        };
    };

    password: string;

    image?: string;

    isVerified?: boolean;
    isActive?: boolean;

    doctorInfo?: {
        isCertified: boolean;
        frontIdImage: string;
        backIdImage: string;
        certImage: string;
    };

    userInfo?: {
        age: string;
        weight: number;
        height: number;
        gender: "رجل" | "انثى";
        diseases: string[];
    };

    cardPayment?: {
        number: number;
        name: string;
        csv: number;
        expDate: string;
    };

    role: "user" | "doctor";

    createdAt?: Date;
    updatedAt?: Date;
    // eslint-disable-next-line no-unused-vars
    comparePassword(password: string): Promise<boolean>;
}
