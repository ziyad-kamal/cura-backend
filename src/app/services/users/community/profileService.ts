import { Request } from "express";
import { PostInterface } from "../../../../interfaces/models/PostInterface.js";
import { UserInterface } from "../../../../interfaces/models/UserInterface.js";
import {
    acceptProfileRepo,
    cancelProfileRepo,
    connectProfileRepo,
    getConnectionsProfileRepo,
    ignoreProfileRepo,
    indexProfileRepo,
    updateProfileRepo,
} from "../../../repositories/users/community/profileRepository.js";
import { getNextCursor, getQueryCursor } from "../../../utils/cursorPagination.js";
import { handleS3Files } from "../../../utils/handleS3Files.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
import { ConnectionInterface } from "../../../../interfaces/models/ConnectionInterface.js";

export const indexProfileService = async (req: Request) => {
    const limit = 10;
    const { query, sortField } = getQueryCursor(req, "createdAt");

    const profile = await indexProfileRepo(query, limit, req.params.userId as string, req.user?._id);

    const { hasMore, nextCursor, results } = getNextCursor(profile.posts, limit, sortField);

    const resolvedPosts = await Promise.all(
        results.map(async (post: PostInterface) => ({
            ...post,
            files: await resolveFiles(post.files, post.visibility),
        })),
    );

    const user = profile.user as UserInterface;
    const [resolvedImage, resolvedCoverImage] = await Promise.all([
        user?.image
            ? resolveFiles([{ s3Key: user.image }], "public").then((res) => res[0]?.url)
            : Promise.resolve(null),
        user?.coverImage
            ? resolveFiles([{ s3Key: user.coverImage }], "public").then((res) => res[0]?.url)
            : Promise.resolve(null),
    ]);

    const resolvedUser = {
        ...user,
        ...(resolvedImage && { image: resolvedImage }),
        ...(resolvedCoverImage && { coverImage: resolvedCoverImage }),
    };

    return {
        user: resolvedUser,
        metadata: { hasMore, nextCursor },
        posts: resolvedPosts,
    };
};

export const updateProfileService = async (req: Request): Promise<UserInterface | null> => {
    const { coverImage, image } = req.body;

    const [updatedImage, updatedCoverImage] = await Promise.all([
        image
            ? handleS3Files([{ s3Key: image }], "public/profile/").then((res) => res[0]?.s3Key)
            : Promise.resolve(image),
        coverImage
            ? handleS3Files([{ s3Key: coverImage }], "public/profile/").then((res) => res[0]?.s3Key)
            : Promise.resolve(coverImage),
    ]);

    const user = await updateProfileRepo(
        { ...req.body, image: updatedImage, coverImage: updatedCoverImage },
        req.user?._id as string,
    );

    const [resolvedImage, resolvedCoverImage] = await Promise.all([
        updatedImage
            ? resolveFiles([{ s3Key: updatedImage }], "public").then((res) => res[0]?.url)
            : Promise.resolve(null),
        updatedCoverImage
            ? resolveFiles([{ s3Key: updatedCoverImage }], "public").then((res) => res[0]?.url)
            : Promise.resolve(null),
    ]);

    return {
        ...user,
        ...(resolvedImage && { image: resolvedImage }),
        ...(resolvedCoverImage && { coverImage: resolvedCoverImage }),
    } as UserInterface;
};

export const getConnectionsProfileService = async (req: Request): Promise<ConnectionInterface[]> => {
    const connections = await getConnectionsProfileRepo(req.user!._id);

    await Promise.all(
        connections.map(async (connection) => {
            const sender = connection.sender as unknown as UserInterface;

            if (sender?.image) {
                const [image] = await resolveFiles([{ s3Key: sender.image }], "public");

                sender.image = image.url;
            }
        }),
    );

    return connections;
};

export const connectProfileService = async (req: Request): Promise<void> => {
    await connectProfileRepo(req.params.userId as string, req.user?._id);
};

export const acceptProfileService = async (req: Request): Promise<void> => {
    await acceptProfileRepo(req.params.connectionId as string);
};

export const ignoreProfileService = async (req: Request): Promise<void> => {
    await ignoreProfileRepo(req.params.connectionId as string);
};

export const cancelProfileService = async (req: Request): Promise<void> => {
    await cancelProfileRepo(req.params.connectionId as string);
};
