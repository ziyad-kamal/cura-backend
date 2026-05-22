import { Types } from "mongoose";
import { UserRoles } from '../../enums/UserRoles.js';

export interface UserInterface {
    _id?: Types.ObjectId;

    name: {
        first: string;
        last: string;
    };

    contact: {
        email: string;
        phone?: string;
        address?: {
            city: string;
            street: string;
        };
    };

    password: string;

    isVerified?: boolean;
    isActive?: boolean;

    doctorInfo?: {
        shortConsultPrice: number;
        normalConsultPrice: number;
        LongConsultPrice: number;
        isCertified: boolean;
        frontIdImage: string;
        backIdImage: string;
        certImage: string;
    };

    userInfo?: {
        bio: string;
        job: string;
        age: number;
        weight: number;
        height: number;
        gender: "male" | "female";
        diseases: string;
        medications: string;
        tags: string[];
    };

    cardPayment?: {
        number: string;
        name: string;
        cvv: string;
        expDate: string;
    };

    role: UserRoles;
    image?: string;
    coverImage?: string;

    createdAt?: Date;
    updatedAt?: Date;
    // eslint-disable-next-line no-unused-vars
    comparePassword(password: string): Promise<boolean>;
}
