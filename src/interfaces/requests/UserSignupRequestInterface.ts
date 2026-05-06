import { Request } from "express";
import { UserRoles } from "../../enums/UserRoles.ts";

export interface UserSignupRequestInterface extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: UserRoles;
    };
}
