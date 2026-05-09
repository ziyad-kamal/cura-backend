import { Request } from "express";
import { UserRoles } from '../../enums/UserRoles.js';

export interface SignupRequestInterface extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role: UserRoles;
    };
}
