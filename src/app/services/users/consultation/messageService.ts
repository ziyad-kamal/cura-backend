import { Request } from "express";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { showMessageRepo } from "../../../repositories/users/consultation/messageRepo.js";
import { PaginationType } from "../../../../types/PaginationType.js";
import { MessageInterface } from "../../../../interfaces/models/MessageInterface.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
import { UserInterface } from "../../../../interfaces/models/UserInterface.js";

export const showMessageService = async (req: Request): Promise<PaginationType<MessageInterface, "messages">> => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    let messages = await showMessageRepo(req.params.chatroomId as string, query, limit);

    messages = (await Promise.all(
        messages.map(async (item) => {
            // Assert it as the full interface, or at least a partial containing what you need
            const originalSender = item.sender as UserInterface;
            let updatedSender = { ...originalSender };

            if (originalSender?.image) {
                const resolved = await resolveFiles([{ s3Key: originalSender.image }], "public");
                updatedSender = {
                    ...originalSender,
                    image: resolved[0]?.url || originalSender.image,
                };
            }

            return {
                ...item,
                sender: updatedSender, // This now retains all UserInterface fields (password, role, etc.)
                files: await resolveFiles(item.files, "public"),
            };
        }),
    )) as MessageInterface[]; // Assert the final array matches your expected type

    const { hasMore, nextCursor, results } = getNextCursor(messages, limit, sortField);

    return { metadata: { hasMore, nextCursor }, messages: results };
};
