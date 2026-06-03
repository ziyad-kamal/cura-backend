import { Request } from "express";
import { ChatroomInterface } from "../../../../interfaces/models/ChatroomInterface.js";
import { getChatroomRepo, indexChatroomsRepo } from "../../../repositories/users/consultation/chatroomRepo.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";

export const indexChatroomsService = async (
    req: Request,
): Promise<{ recentMessages: MessageInterface[]; chatrooms: ChatroomInterface[] ,metadata:object}> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");
    const { chatrooms, recentMessages } = await indexChatroomsRepo(req.user?._id as string, query, limit);

    await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        chatrooms.map(async (room: any) => {
            if (room.sender?.image) {
                const resolved = await resolveFiles([{ s3Key: room.sender.image }], "public"); // Adjust visibility ("public"/"private") based on your bucket policy
                room.sender.image = resolved[0]?.url || room.sender.image;
            }
            if (room.receiver?.image) {
                const resolved = await resolveFiles([{ s3Key: room.receiver.image }], "public");
                room.receiver.image = resolved[0]?.url || room.receiver.image;
            }
        }),
    );

    // 2. Resolve files and sender images for the recent messages
    if (recentMessages && recentMessages.length > 0) {
        await Promise.all(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            recentMessages.map(async (msg: any) => {
                if (msg.files?.length) {
                    msg.files = await resolveFiles(msg.files, "public");
                }

                if (msg.sender?.image) {
                    const fileObj =
                        typeof msg.sender.image === "string" ? { s3Key: msg.sender.image } : msg.sender.image;
                    const resolved = await resolveFiles([fileObj], "public");
                    msg.sender.image = resolved[0]?.url || msg.sender.image;
                }
            }),
        );
    }

    const { hasMore, nextCursor, results } = getNextCursor(chatrooms, limit, sortField);

    return { recentMessages,metadata:{hasMore,nextCursor} ,chatrooms: results };
};

export const getChatroomService = async (req: Request): Promise<ChatroomInterface> => {
    return await getChatroomRepo(req.params.receiverId as string, req.user?._id as string);
};
