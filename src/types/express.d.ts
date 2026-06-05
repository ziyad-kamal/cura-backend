/* eslint-disable no-unused-vars */
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
        interface Response {
            cookieHelper: (name: string, value: string, maxAge: number) => Response;
        }
    }
}
