import mongoose, { Types } from "mongoose";

export interface ConnectionInterface {
    _id?: Types.ObjectId;
    senderId: mongoose.Types.ObjectId;
    receiverId: mongoose.Types.ObjectId;
    status: "معلق"|'تم التجاهل'|'تم الموافقة'
    createdAt?: Date;
    updatedAt?: Date;
}
