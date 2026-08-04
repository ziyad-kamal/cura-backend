import User from "../../models/User.js";
export const loginRepo = (email) => {
    return User.findOne({
        "contact.email": email,
    }).select("+password");
};
export const googleLoginRepo = async (payload) => {
    let user = await User.findOne({
        "contact.email": payload.email,
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
export const signupRepo = async (firstName, lastName, email, password, role) => {
    return await User.create({
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
//# sourceMappingURL=authRepository.js.map