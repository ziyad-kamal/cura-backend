import { UserRoles } from '../../../enums/UserRoles.js';
import { UserInterface } from '../../../interfaces/models/UserInterface.js';
import RecordExistError from '../../errors/RecordExistError.js';
import User from '../../models/User.js';

export const loginRepo = (email: string): Promise<UserInterface | null> => {
    return User.findOne({
        contact: {
            email,
        },
    }).select("+password");
};

export const googleLoginRepo = async (payload: { email: string; given_name :string,family_name:string}): Promise<UserInterface | null> => {
    let user = await User.findOne({
        "contact.email": payload.email,
        provider: "google",
    });

    if (!user) {
        user = await User.create({
            contact: {
                email: payload.email,
            },
            provider: "google",
            isVerified: true,
            name: {
                first: payload.given_name,
                last: payload.family_name || "",
            },
        });
    }

    return user;
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

    const createdUser= await User.create({
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

    return createdUser.toJSON();
};
