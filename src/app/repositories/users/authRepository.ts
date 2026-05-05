import { UserInterface } from "../../../interfaces/models/UserInterface.ts";
import User from "../../models/User.ts";

export const loginRepo = (email: string): Promise<UserInterface | null> => {
    return User.findOne({
        contact: {
            email,
        },
    }).select("+password");
};

export const userSignupRepo = (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: "user" | "doctor",
): Promise<UserInterface> => {
    return User.create({
        name: {
            first: firstName,
            last: lastName,
        },
        password,
        contact: {
            email,
        },
        role,
    });
};
