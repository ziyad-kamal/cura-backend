import { Request } from "express";

export interface ForgetPasswordRequestInterface extends Request {
    body: {
        email: string;
    };
}
