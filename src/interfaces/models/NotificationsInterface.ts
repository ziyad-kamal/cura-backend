import { Types } from "mongoose";

export interface NotificationInterface {
    _id?: Types.ObjectId;
    type: "like" | "comment" | "connection" | "message";
    message: string;
    isRead: boolean;
    post?: Types.ObjectId;
    receiver: Types.ObjectId;
    sender?: Types.ObjectId;
    createdAt?: Date;
}
