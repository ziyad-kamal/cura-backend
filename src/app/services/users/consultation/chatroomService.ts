import { Request } from "express";
import { ChatroomInterface } from "../../../../interfaces/models/ChatroomInterface.js";
import { getChatroomRepo, indexChatroomsRepo } from "../../../repositories/users/consultation/chatroomRepo.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { PaginationType } from "../../../../types/PaginationType.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";
import { RedisService } from "./onlineUserService.js";

export const indexChatroomsService = async (
    req: Request,
): Promise<
    PaginationType<ChatroomInterface, "chatrooms"> & {
        recentMessages: MessageInterface[];
    }
> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "lastMessageAt");
    const { chatrooms, recentMessages } = await indexChatroomsRepo(req.user?._id as string, query, limit);

    // 1. Resolve chatroom profile images safely
    await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chatrooms.map(async (room: any) => {
            if (room.sender?.image && !room.sender.image.startsWith("http")) {
                const resolved = await resolveFiles([{ s3Key: room.sender.image }], "public");
                room.sender.image = resolved[0]?.url || room.sender.image;
            }
            
            if (room.receiver?.image && !room.receiver.image.startsWith("http")) {
                const resolved = await resolveFiles([{ s3Key: room.receiver.image }], "public");
                room.receiver.image = resolved[0]?.url || room.receiver.image;
            }
        }),
    );

    // 2. Resolve files and sender images for recent messages safely
    if (recentMessages && recentMessages.length > 0) {
        await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recentMessages.map(async (msg: any) => {
                if (msg.files?.length) {
                    msg.files = await resolveFiles(msg.files, "private");
                }

                if (msg.sender?.image && !msg.sender.image.startsWith("http")) {
                    const resolved = await resolveFiles([{ s3Key: msg.sender.image }], "public");
                    msg.sender.image = resolved[0]?.url || msg.sender.image;
                }
            }),
        );
    }

    const { hasMore, nextCursor, results } = getNextCursor(chatrooms, limit, sortField);

    return { recentMessages, metadata: { hasMore, nextCursor }, chatrooms: results };
};

export const getChatroomService = async (req: Request): Promise<ChatroomInterface> => {
    return await getChatroomRepo(req.params.receiverId as string, req.user?._id as string);
};

export const checkUsersStatusService = async (req: Request): Promise<Record<string, boolean>> => {
    const { userIds } = req.body;

    const onlineStatusMap = await RedisService.getUsersOnlineStatus(userIds);

    return onlineStatusMap;
};
