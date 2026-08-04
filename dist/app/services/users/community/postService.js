import { deletePostRepo, indexPostsRepo, likePostRepo, repostPostRepo, storePostRepo, updatePostRepo, } from "../../../repositories/users/community/postRepository.js";
import { handleS3Files } from "../../../utils/handleS3Files.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
export const indexPostsService = async (req) => {
    var _a;
    const authId = (_a = req.user) === null || _a === void 0 ? void 0 : _a._id;
    const cursor = req.query.cursor;
    let { feed, hasMore, nextCursor } = await indexPostsRepo(authId, cursor);
    feed = await Promise.all(feed.map(async (item) => {
        var _a, _b, _c, _d, _e, _f;
        const userImageUrl = ((_a = item.user) === null || _a === void 0 ? void 0 : _a.image) && !item.user.image.startsWith("http")
            ? await resolveFiles([{ s3Key: item.user.image }], "public").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.url; })
            : (_b = item.user) === null || _b === void 0 ? void 0 : _b.image;
        const originalPostUserImageUrl = ((_d = (_c = item.post) === null || _c === void 0 ? void 0 : _c.user) === null || _d === void 0 ? void 0 : _d.image) && !item.post.user.image.startsWith("http")
            ? await resolveFiles([{ s3Key: item.post.user.image }], "public").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.url; })
            : (_f = (_e = item.post) === null || _e === void 0 ? void 0 : _e.user) === null || _f === void 0 ? void 0 : _f.image;
        const resolvedComments = await Promise.all((item.comments || []).map(async (comment) => {
            const user = comment.user;
            const commentUserImageUrl = (user === null || user === void 0 ? void 0 : user.image) && !user.image.startsWith("http")
                ? await resolveFiles([{ s3Key: user.image }], "public").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.url; })
                : user === null || user === void 0 ? void 0 : user.image;
            return Object.assign(Object.assign({}, comment), { user: comment.user
                    ? Object.assign(Object.assign({}, comment.user), (commentUserImageUrl && {
                        image: commentUserImageUrl,
                    })) : comment.user });
        }));
        return Object.assign(Object.assign(Object.assign({}, item), { files: await resolveFiles(item.files, item.visibility), comments: resolvedComments, user: item.user
                ? Object.assign(Object.assign({}, item.user), (userImageUrl && { image: userImageUrl })) : item.user }), (item.post
            ? {
                post: Object.assign(Object.assign({}, item.post), { files: await resolveFiles(item.post.files, item.post.visibility), user: item.post.user
                        ? Object.assign(Object.assign({}, item.post.user), (originalPostUserImageUrl && {
                            image: originalPostUserImageUrl,
                        })) : item.post.user }),
            }
            : {}));
    }));
    return { metadata: { hasMore, nextCursor }, posts: feed };
};
export const storePostService = async (req) => {
    var _a;
    const { files, visibility } = req.body;
    let updatedFiles = await handleS3Files(files, "public/posts/");
    const post = await storePostRepo(Object.assign(Object.assign({}, req.body), { files: updatedFiles, user: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id }));
    let finalPost = Object.assign({}, post);
    if (updatedFiles.length > 0) {
        const resolvedFiles = await resolveFiles(updatedFiles, visibility);
        finalPost = Object.assign(Object.assign({}, post), { files: resolvedFiles });
    }
    const user = finalPost.user;
    if (user === null || user === void 0 ? void 0 : user.image) {
        const resolvedImage = await resolveFiles([{ s3Key: user.image }], "public");
        user.image = resolvedImage[0].url;
    }
    return finalPost;
};
export const repostPostService = async (req) => {
    var _a;
    return await repostPostRepo(Object.assign({}, req.body), (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
};
export const updatePostService = async (req) => {
    const { files, visibility } = req.body;
    let updatedFiles = await handleS3Files(files, "public/posts/");
    const post = await updatePostRepo(Object.assign(Object.assign(Object.assign({}, req.body), { files: updatedFiles }), req.params));
    let finalPost = Object.assign({}, post);
    if (updatedFiles.length > 0) {
        const resolvedFiles = await resolveFiles(updatedFiles, visibility);
        finalPost = Object.assign(Object.assign({}, post), { files: resolvedFiles });
    }
    const user = finalPost.user;
    if (user === null || user === void 0 ? void 0 : user.image) {
        const resolvedImage = await resolveFiles([{ s3Key: user.image }], "public");
        user.image = resolvedImage[0].url;
    }
    return finalPost;
};
export const likePostService = async (req) => {
    var _a;
    return await likePostRepo(req.params._id, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
};
export const deletePostService = async (req) => {
    await deletePostRepo(req.params._id);
};
//# sourceMappingURL=postService.js.map