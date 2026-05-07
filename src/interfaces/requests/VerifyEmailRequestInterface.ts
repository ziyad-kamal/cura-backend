import { Request } from "express";

export interface VerifyEmailRequestInterface extends Request {
    query: {
        email: string;
        token: string;
    };
}
