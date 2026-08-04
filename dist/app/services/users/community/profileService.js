import { acceptProfileRepo, cancelProfileRepo, connectProfileRepo, getConnectionsProfileRepo, ignoreProfileRepo, indexProfileRepo, updateProfileRepo, } from "../../../repositories/users/community/profileRepository.js";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { handleS3Files } from "../../../utils/handleS3Files.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
export const indexProfileService = async (req) => {
    var _a;
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");
    const profile = await indexProfileRepo(query, limit, req.params.userId, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    const { hasMore, nextCursor, results } = getNextCursor(profile.posts, limit, sortField);
    const resolvedPosts = await Promise.all(results.map(async (post) => (Object.assign(Object.assign({}, post), { files: await resolveFiles(post.files, post.visibility) }))));
    const user = profile.user;
    const [resolvedImage, resolvedCoverImage] = await Promise.all([
        (user === null || user === void 0 ? void 0 : user.image)
            ? resolveFiles([{ s3Key: user.image }], "public").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.url; })
            : Promise.resolve(null),
        (user === null || user === void 0 ? void 0 : user.coverImage)
            ? resolveFiles([{ s3Key: user.coverImage }], "public").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.url; })
            : Promise.resolve(null),
    ]);
    const resolvedUser = Object.assign(Object.assign(Object.assign({}, user), (resolvedImage && { image: resolvedImage })), (resolvedCoverImage && { coverImage: resolvedCoverImage }));
    return {
        user: resolvedUser,
        metadata: { hasMore, nextCursor },
        posts: resolvedPosts,
    };
};
export const updateProfileService = async (req) => {
    var _a;
    const { coverImage, image } = req.body;
    const [updatedImage, updatedCoverImage] = await Promise.all([
        image
            ? handleS3Files([{ s3Key: image }], "public/profile/").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.s3Key; })
            : Promise.resolve(image),
        coverImage
            ? handleS3Files([{ s3Key: coverImage }], "public/profile/").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.s3Key; })
            : Promise.resolve(coverImage),
    ]);
    const user = await updateProfileRepo(Object.assign(Object.assign({}, req.body), { image: updatedImage, coverImage: updatedCoverImage }), (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
    const [resolvedImage, resolvedCoverImage] = await Promise.all([
        updatedImage
            ? resolveFiles([{ s3Key: updatedImage }], "public").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.url; })
            : Promise.resolve(null),
        updatedCoverImage
            ? resolveFiles([{ s3Key: updatedCoverImage }], "public").then((res) => { var _a; return (_a = res[0]) === null || _a === void 0 ? void 0 : _a.url; })
            : Promise.resolve(null),
    ]);
    return Object.assign(Object.assign(Object.assign({}, user), (resolvedImage && { image: resolvedImage })), (resolvedCoverImage && { coverImage: resolvedCoverImage }));
};
export const getConnectionsProfileService = async (req) => {
    const connections = await getConnectionsProfileRepo(req.user._id);
    await Promise.all(connections.map(async (connection) => {
        const sender = connection.sender;
        if (sender === null || sender === void 0 ? void 0 : sender.image) {
            const [image] = await resolveFiles([{ s3Key: sender.image }], "public");
            sender.image = image.url;
        }
    }));
    return connections;
};
export const connectProfileService = async (req) => {
    var _a;
    await connectProfileRepo(req.params.userId, (_a = req.user) === null || _a === void 0 ? void 0 : _a._id);
};
export const acceptProfileService = async (req) => {
    await acceptProfileRepo(req.params.connectionId);
};
export const ignoreProfileService = async (req) => {
    await ignoreProfileRepo(req.params.connectionId);
};
export const cancelProfileService = async (req) => {
    await cancelProfileRepo(req.params.connectionId);
};
//# sourceMappingURL=profileService.js.map