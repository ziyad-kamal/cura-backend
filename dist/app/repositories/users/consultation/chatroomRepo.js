import { findRecord } from "../../../utils/findRecord.js";
import Chatroom from "../../../models/Chatroom.js";
import Message from "../../../models/Message.js";
export const indexChatroomsRepo = async (authId, query, limit) => {
    const chatrooms = await Chatroom.find(Object.assign(Object.assign({}, query), { $or: [{ sender: authId }, { receiver: authId }] }))
        .populate({
        path: "lastMessage",
        populate: {
            path: "sender",
            select: "name.first name.last",
        },
    })
        .populate("sender", "name.first name.last image")
        .populate("receiver", "name.first name.last image")
        .sort({
        lastMessageAt: -1,
    })
        .limit(limit + 1)
        .lean();
    chatrooms.sort((a, b) => {
        const lastMsgA = a.lastMessage;
        const lastMsgB = b.lastMessage;
        const dateA = (lastMsgA === null || lastMsgA === void 0 ? void 0 : lastMsgA.createdAt) ? new Date(lastMsgA.createdAt) : new Date(a.createdAt);
        const dateB = (lastMsgB === null || lastMsgB === void 0 ? void 0 : lastMsgB.createdAt) ? new Date(lastMsgB.createdAt) : new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
    });
    const mostRecentActiveRoom = chatrooms[0];
    let recentMessages;
    if (mostRecentActiveRoom) {
        recentMessages = await Message.find({ chatroom: mostRecentActiveRoom._id })
            .sort({ createdAt: -1 })
            .populate("sender", "name.first name.last image")
            .limit(10)
            .lean();
    }
    return { recentMessages: recentMessages, chatrooms };
};
export const getChatroomRepo = async (receiver, sender) => {
    return await findRecord(Chatroom, { $or: [{ sender, receiver }, { sender: receiver, receiver: sender }] });
};
//# sourceMappingURL=chatroomRepo.js.map