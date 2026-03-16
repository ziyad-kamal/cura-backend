export interface CookieInterface {
    httpOnly: boolean;
    secure: boolean;
    sameSite: "lax" | "strict" | "none";
    maxAge: number;
    path: string;
}
