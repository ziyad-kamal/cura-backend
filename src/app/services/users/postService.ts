import { Request } from "express";
import { PostInterface } from "../../../interfaces/models/PostInterface.js";
import {
    deletePostRepo,
    indexPostsRepo,
    likePostRepo,
    repostPostRepo,
    storePostRepo,
    updatePostRepo,
} from "../../repositories/users/postRepository.js";
import { awsConfig, s3Client } from "../../../config/aws.js";
import { CopyObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import NotFoundError from "../../errors/NotFoundError.js";
import CustomError from "../../errors/CustomError.js";

export const indexPostsService = async (req: Request) => {
    const authId = req.user?._id as string;
    const cursor = req.query.cursor as string | undefined;

    const { feed, hasMore, nextCursor } = await indexPostsRepo(authId, cursor);

    return { metadata: { hasMore, nextCursor }, posts: feed };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    const { files } = req.body;

    let updatedFiles = files || [];

    if (files && files.length > 0) {
        updatedFiles = await Promise.all(
            files.map(async (file: { s3Key: string; type: string; name: string }) => {
                if (!file.s3Key) {
                    throw new NotFoundError("Missing required s3Key in request body.");
                }

                if (!file.s3Key.startsWith("staging/")) {
                    throw new CustomError("Invalid s3Key format. Expected to start with 'staging/'.", 400);
                }

                const finalKey = file.s3Key.replace("staging/", `public/posts/`);
                const bucketName = awsConfig.s3_bucket_name;

                await s3Client.send(
                    new CopyObjectCommand({
                        Bucket: bucketName,
                        CopySource: encodeURIComponent(`${bucketName}/${file.s3Key}`),
                        Key: finalKey,
                    }),
                );

                await s3Client.send(
                    new DeleteObjectCommand({
                        Bucket: bucketName,
                        Key: file.s3Key,
                    }),
                );

                return { ...file, s3Key: finalKey };
            }),
        );
    }

    return await storePostRepo({ ...req.body, files: updatedFiles, user: req.user?._id });
};

export const repostPostService = async (req: Request): Promise<boolean> => {
    return await repostPostRepo({ ...req.body }, req.user?._id);
};

export const updatePostService = async (req: Request): Promise<PostInterface | null> => {
    return await updatePostRepo({ ...req.body, ...req.params });
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string, req.user?._id);
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
