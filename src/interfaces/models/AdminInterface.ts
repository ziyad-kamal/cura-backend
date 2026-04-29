export interface AdminInterface {
    name: String;
    email: string;
    phone: Number;

    password: string;

    createdAt?: Date;
    updatedAt?: Date;

    // eslint-disable-next-line no-unused-vars
    comparePassword(password: string): Promise<boolean>;
}
