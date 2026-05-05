import { Request } from "express";

export interface LoginRequestInterface extends Request {
    body: {
        email: string;
        password: string;
    };
}
