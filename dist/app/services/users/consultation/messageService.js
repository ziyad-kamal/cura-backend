import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { showMessageRepo } from "../../../repositories/users/consultation/messageRepo.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
export const showMessageService = async (req) => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");
    let messages = await showMessageRepo(req.params.chatroomId, query, limit);
    messages = (await Promise.all(messages.map(async (item) => {
        var _a;
        // Assert it as the full interface, or at least a partial containing what you need
        const originalSender = item.sender;
        let updatedSender = Object.assign({}, originalSender);
        if (originalSender === null || originalSender === void 0 ? void 0 : originalSender.image) {
            const resolved = await resolveFiles([{ s3Key: originalSender.image }], "public");
            updatedSender = Object.assign(Object.assign({}, originalSender), { image: ((_a = resolved[0]) === null || _a === void 0 ? void 0 : _a.url) || originalSender.image });
        }
        return Object.assign(Object.assign({}, item), { sender: updatedSender, files: await resolveFiles(item.files, "public") });
    }))); // Assert the final array matches your expected type
    const { hasMore, nextCursor, results } = getNextCursor(messages, limit, sortField);
    return { metadata: { hasMore, nextCursor }, messages: results };
};
//# sourceMappingURL=messageService.js.map