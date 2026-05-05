import { Request } from "express";

export interface UserSignupRequestInterface extends Request {
    body: {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
        role:string
    };
}
