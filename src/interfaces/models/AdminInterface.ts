import { Types } from "mongoose";

export interface AdminInterface {
        _id?: Types.ObjectId;
    
    name: String;
    email: string;
    phone: Number;

    password: string;
    role:string

    createdAt?: Date;
    updatedAt?: Date;

    // eslint-disable-next-line no-unused-vars
    comparePassword(password: string): Promise<boolean>;
}
