export interface UserInterface {
    username: string;
    email: string;
    password: string;
    fullName?: string;
    imagePath: string;
    bio?: string;
    role: "user" | "admin";
    createdAt: Date;
    updatedAt: Date;
    // eslint-disable-next-line no-unused-vars
    comparePassword(password: string): Promise<boolean>;
}
