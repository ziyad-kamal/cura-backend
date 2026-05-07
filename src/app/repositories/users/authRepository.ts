import { UserRoles } from "../../../enums/UserRoles.ts";
import { UserInterface } from "../../../interfaces/models/UserInterface.ts";
import RecordExistError from "../../errors/RecordExistError.ts";
import User from "../../models/User.ts";

export const loginRepo = (email: string): Promise<UserInterface | null> => {
    return User.findOne({
        contact: {
            email,
        },
    }).select("+password");
};

export const signupRepo = async (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: UserRoles,
): Promise<UserInterface> => {
    const user = await User.findOne({
        contact: {
            email,
        },
    });

    if (user) {
        throw new RecordExistError("this email is used");
    }

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
