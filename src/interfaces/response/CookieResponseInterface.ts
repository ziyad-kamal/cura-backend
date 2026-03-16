import { Response } from "express";

export interface CookieResponseInterface extends Response {
    // eslint-disable-next-line no-unused-vars
    cookieHelper: (name: string, value: string, maxAge: number) => Response;
}
