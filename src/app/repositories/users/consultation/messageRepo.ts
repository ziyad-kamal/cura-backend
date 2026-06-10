import { findRecord } from "../../../utils/findRecord.js";
import Chatroom from "../../../models/Chatroom.js";
import Message from "../../../models/Message.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";
import { Types } from "mongoose";

export const storeMessageRepo = async (
    receiver: string,
    sender: string,
    content: string,
    files: { s3Key: string }[],
    chatroom: string,
): Promise<MessageInterface> => {
    const message = await (
        await Message.create({
            content,
            files,
            sender: new Types.ObjectId(sender),
            receiver,
            chatroom,
            createdAt: new Date(),
        })
    ).populate("sender", "name.first name.last image");

    const chatroomRecord = await findRecord(Chatroom, { _id: chatroom });
    await chatroomRecord.updateOne({ lastMessage: message._id, lastMessageAt: message.createdAt });

    return message.toJSON();
};

export const showMessageRepo = async (
    _id: string,
    query: {
        [key: string]: unknown;
    },
    limit: number,
): Promise<MessageInterface[]> => {
    await findRecord(Chatroom, { _id });

    return await Message.find({ ...query, chatroom: _id })
        .select("content files chatroom sender createdAt")
        .populate("sender", "name.first name.last image")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
};

export const markMessageAsReadRepo = async (chatroom: string): Promise<void> => {
    await Message.updateMany({ chatroom, isRead: false }, { isRead: true });
};
