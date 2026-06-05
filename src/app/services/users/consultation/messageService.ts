import { Request } from "express";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { showMessageRepo } from "../../../repositories/users/consultation/messageRepo.js";
import { PaginationType } from "../../../../types/PaginationType.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";

export const showMessageService = async (req: Request): Promise<PaginationType<MessageInterface, "messages">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    let messages = await showMessageRepo(req.params.chatroomId as string, query, limit);

    messages = await Promise.all(
        messages.map(async (item) => ({
            ...item,
            files: await resolveFiles(item.files, 'public'),
        })),
    );

    const { hasMore, nextCursor, results } = getNextCursor(messages, limit, sortField);

    return { metadata: { hasMore, nextCursor }, messages: results };
};
