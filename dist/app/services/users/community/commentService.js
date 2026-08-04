import Post from "../../../models/Post.js";
import Repost from "../../../models/Repost.js";
import { destroyCommentRepo, indexCommentRepo, likeCommentRepo, storeCommentRepo, updateCommentRepo, } from "../../../repositories/users/community/commentRepository.js";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
export const indexCommentService = async (req) => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");
    const post = req.params.type === "post" ? { model: Post, key: "post" } : { model: Repost, key: "repost" };
    const comments = await indexCommentRepo(query, limit, post, req.params._id);
    const { hasMore, nextCursor, results } = getNextCursor(comments, limit, sortField);
    const resolvedComments = await Promise.all(results.map(async (comment) => {
        var _a;
        const user = comment.user;
        if ((user === null || user === void 0 ? void 0 : user.image) && !user.image.startsWith("http")) {
            const [image] = await resolveFiles([{ s3Key: user.image }], "public");
            user.image = (_a = image.url) !== null && _a !== void 0 ? _a : user.image;
        }
        return comment;
    }));
    return { metadata: { hasMore, nextCursor }, comments: resolvedComments };
};
export const storeCommentService = async (req) => {
    var _a;
    const post = req.params.type === "post" ? { model: Post, key: "post" } : { model: Repost, key: "repost" };
    const comment = await storeCommentRepo(Object.assign({}, req.body), (_a = req.user) === null || _a === void 0 ? void 0 : _a._id, post, req.params._id);
    const user = comment.user;
    if (user.image) {
        const [image] = await resolveFiles([{ s3Key: user.image }], "public");
        if (image === null || image === void 0 ? void 0 : image.url) {
            user.image = image.url;
        }
    }
    return comment;
};
export const updateCommentService = async (req) => {
    return await updateCommentRepo(Object.assign({}, req.body), req.params._id);
};
export const likeCommentService = async (req) => {
    var _a;
    return await likeCommentRepo(req.params._id, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
};
export const destroyCommentService = async (req) => {
    return await destroyCommentRepo(req.params._id);
};
//# sourceMappingURL=commentService.js.map