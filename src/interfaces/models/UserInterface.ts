export interface UserInterface {
    name: {
        first: string;
        last: string;
    };

    contact: {
        email: string;
        phone: number;
        address: {
            city: string;
            street: string;
        };
    };

    password: string;

    image?: string;

    isVerified: boolean;
    isActive: boolean;

    doctorInfo?: {
        specialization: string;
        isCertified: boolean;
        frontIdImage?: string;
        backIdImage?: string;
        certificationImage?: string;
    };

    userInfo?: {
        age: string;
        weight: number;
        height: number;
        gender?: "male" | "female";
        diseases: string[];
    };

    cardPayment?: {
        number?: number;
        name?: string;
        csv?: number;
        expDate?: string;
    };

    role: "user" | "doctor";

    createdAt?: Date;
    updatedAt?: Date;
    // eslint-disable-next-line no-unused-vars
    comparePassword(password: string): Promise<boolean>;
}
