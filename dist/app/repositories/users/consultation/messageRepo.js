import { findRecord } from "../../../utils/findRecord.js";
import Chatroom from "../../../models/Chatroom.js";
import Message from "../../../models/Message.js";
import { Types } from "mongoose";
export const storeMessageRepo = async (receiver, sender, content, files, chatroom) => {
    const message = await (await Message.create({
        content,
        files,
        sender: new Types.ObjectId(sender),
        receiver,
        chatroom,
        createdAt: new Date(),
    })).populate("sender", "name.first name.last image");
    const chatroomRecord = await findRecord(Chatroom, { _id: chatroom });
    await chatroomRecord.updateOne({ lastMessage: message._id, lastMessageAt: message.createdAt });
    return message.toJSON();
};
export const showMessageRepo = async (_id, query, limit) => {
    await findRecord(Chatroom, { _id });
    return await Message.find(Object.assign(Object.assign({}, query), { chatroom: _id }))
        .select("content files chatroom sender createdAt")
        .populate("sender", "name.first name.last image")
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean();
};
export const markMessageAsReadRepo = async (chatroom) => {
    await Message.updateMany({ chatroom, isRead: false }, { isRead: true });
};
//# sourceMappingURL=messageRepo.js.map