import { getChatroomRepo, indexChatroomsRepo } from "../../../repositories/users/consultation/chatroomRepo.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { RedisService } from "./onlineUserService.js";
import Chatroom from "../../../models/Chatroom.js";
import Consultation from "../../../models/Consultation.js";
import mongoose from "mongoose";
export const indexChatroomsService = async (req) => {
    var _a;
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "lastMessageAt");
    const { chatrooms, recentMessages } = await indexChatroomsRepo((_a = req.user) === null || _a === void 0 ? void 0 : _a._id, query, limit);
    // 1. Resolve chatroom profile images safely
    await Promise.all(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    chatrooms.map(async (room) => {
        var _a, _b, _c, _d;
        if (((_a = room.sender) === null || _a === void 0 ? void 0 : _a.image) && !room.sender.image.startsWith("http")) {
            const resolved = await resolveFiles([{ s3Key: room.sender.image }], "public");
            room.sender.image = ((_b = resolved[0]) === null || _b === void 0 ? void 0 : _b.url) || room.sender.image;
        }
        if (((_c = room.receiver) === null || _c === void 0 ? void 0 : _c.image) && !room.receiver.image.startsWith("http")) {
            const resolved = await resolveFiles([{ s3Key: room.receiver.image }], "public");
            room.receiver.image = ((_d = resolved[0]) === null || _d === void 0 ? void 0 : _d.url) || room.receiver.image;
        }
    }));
    // 2. Resolve files and sender images for recent messages safely
    if (recentMessages && recentMessages.length > 0) {
        await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        recentMessages.map(async (msg) => {
            var _a, _b, _c;
            if ((_a = msg.files) === null || _a === void 0 ? void 0 : _a.length) {
                msg.files = await resolveFiles(msg.files, "private");
            }
            if (((_b = msg.sender) === null || _b === void 0 ? void 0 : _b.image) && !msg.sender.image.startsWith("http")) {
                const resolved = await resolveFiles([{ s3Key: msg.sender.image }], "public");
                msg.sender.image = ((_c = resolved[0]) === null || _c === void 0 ? void 0 : _c.url) || msg.sender.image;
            }
        }));
    }
    const { hasMore, nextCursor, results } = getNextCursor(chatrooms, limit, sortField);
    return { recentMessages, metadata: { hasMore, nextCursor }, chatrooms: results };
};
export const getChatroomService = async (req) => {
    var _a;
    return await getChatroomRepo(req.params.receiverId, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
};
export const checkUsersStatusService = async (req) => {
    const { userIds } = req.body;
    const onlineStatusMap = await RedisService.getUsersOnlineStatus(userIds);
    return onlineStatusMap;
};
export const endChatroomService = async (chatroomId, userId) => {
    const chatroom = await Chatroom.findById(chatroomId);
    if (!chatroom) {
        throw new Error("Chatroom not found");
    }
    if (String(chatroom.sender) !== userId && String(chatroom.receiver) !== userId) {
        throw new Error("Unauthorized to end this session");
    }
    chatroom.isActive = false;
    await chatroom.save();
    if (chatroom.consultation) {
        await Consultation.findByIdAndUpdate(chatroom.consultation, {
            status: "completed",
        });
    }
    else {
        await Consultation.findOneAndUpdate({ chatroom: new mongoose.Types.ObjectId(chatroomId) }, { status: "completed" });
    }
    return chatroom;
};
//# sourceMappingURL=chatroomService.js.map