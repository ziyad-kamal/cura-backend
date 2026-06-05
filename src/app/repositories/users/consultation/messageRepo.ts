import { findRecord } from "../../../utils/findRecord.js";
import Chatroom from "../../../models/Chatroom.js";
import Message from "../../../models/Message.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";

export const storeMessageRepo = async (
    receiver: string,
    sender: string,
    content: string,
    chatroom: string,
): Promise<MessageInterface> => {
    return (
        await Message.create({
            content,
            sender,
            receiver,
            chatroom,
        })
    ).populate("sender", "name.first name.last image");
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
    Message.updateMany({ chatroom, isRead: false }, { isRead: true });
};
