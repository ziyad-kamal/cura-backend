import { Request } from "express";

export interface ResetPasswordRequestInterface extends Request {
    query: {
        email: string;
        token: string;
    }

    body: {
        password: string;
    };
}
