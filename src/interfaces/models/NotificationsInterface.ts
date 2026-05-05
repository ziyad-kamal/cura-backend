import { Types } from "mongoose";

export interface NotificationInterface {
    _id?: Types.ObjectId;
    type: "like" | "comment" | "connection" | "message";
    message: string;
    isRead: boolean;
    postId?: Types.ObjectId;
    receiverId: Types.ObjectId;
    senderId?: Types.ObjectId;
    createdAt?: Date;
}
