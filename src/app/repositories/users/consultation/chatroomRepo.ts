import { findRecord } from "../../../utils/findRecord.js";
import Chatroom from "../../../models/Chatroom.js";
import { ChatroomInterface } from "../../../../interfaces/models/ChatroomInterface.js";
import Message from "../../../models/Message.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";

export const indexChatroomsRepo = async (
    authId: string,
    query: {
        [key: string]: unknown;
    },
    limit: number,
): Promise<{ recentMessages: MessageInterface[]; chatrooms: ChatroomInterface[] }> => {
    const chatrooms = await Chatroom.find({
        ...query,
        $or: [{ sender: authId }, { receiver: authId }],
    })
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
            isActive: -1,
            createdAt: -1,
        })
        .limit(limit + 1)
        .lean();

    chatrooms.sort((a, b) => {
        const lastMsgA = a.lastMessage as unknown as MessageInterface;
        const lastMsgB = b.lastMessage as unknown as MessageInterface;

        const dateA = lastMsgA?.createdAt ? new Date(lastMsgA.createdAt) : new Date(a.createdAt);
        const dateB = lastMsgB?.createdAt ? new Date(lastMsgB.createdAt) : new Date(b.createdAt);

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

    return { recentMessages: recentMessages as MessageInterface[], chatrooms };
};

export const getChatroomRepo = async (receiver: string, sender: string): Promise<ChatroomInterface> => {
    return await findRecord(Chatroom, { $or: [{ sender, receiver }, { sender: receiver, receiver: sender }] });
};
