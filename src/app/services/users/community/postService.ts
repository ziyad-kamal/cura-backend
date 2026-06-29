import { Request } from "express";
import { PostInterface } from "../../../../interfaces/models/PostInterface.js";
import {
    deletePostRepo,
    indexPostsRepo,
    likePostRepo,
    repostPostRepo,
    storePostRepo,
    updatePostRepo,
} from "../../../repositories/users/community/postRepository.js";
import { handleS3Files } from "../../../utils/handleS3Files.js";
import { resolveFiles } from "../../../utils/resolveFiles.js";
import { CommentInterface } from "../../../../interfaces/models/CommentInterface.js";
import { UserInterface } from "../../../../interfaces/models/UserInterface.js";

export const indexPostsService = async (req: Request) => {
    const authId = req.user?._id as string;
    const cursor = req.query.cursor as string | undefined;

    let { feed, hasMore, nextCursor } = await indexPostsRepo(authId, cursor);

    feed = await Promise.all(
        feed.map(async (item) => {
            const userImageUrl =
                item.user?.image && !item.user.image.startsWith("http")
                    ? await resolveFiles([{ s3Key: item.user.image }], "public").then((res) => res[0]?.url)
                    : item.user?.image;

            const originalPostUserImageUrl =
                item.post?.user?.image && !item.post.user.image.startsWith("http")
                    ? await resolveFiles([{ s3Key: item.post.user.image }], "public").then((res) => res[0]?.url)
                    : item.post?.user?.image;

            const resolvedComments = await Promise.all(
                (item.comments || []).map(async (comment: CommentInterface) => {
                    const user = comment.user as unknown as UserInterface;
                    const commentUserImageUrl =
                        user?.image && !user.image.startsWith("http")
                            ? await resolveFiles([{ s3Key: user.image }], "public").then((res) => res[0]?.url)
                            : user?.image;

                    return {
                        ...comment,
                        user: comment.user
                            ? {
                                  ...comment.user,
                                  ...(commentUserImageUrl && {
                                      image: commentUserImageUrl,
                                  }),
                              }
                            : comment.user,
                    };
                }),
            );

            return {
                ...item,
                files: await resolveFiles(item.files, item.visibility),

                comments: resolvedComments,

                user: item.user
                    ? {
                          ...item.user,
                          ...(userImageUrl && { image: userImageUrl }),
                      }
                    : item.user,

                ...(item.post
                    ? {
                          post: {
                              ...item.post,
                              files: await resolveFiles(item.post.files, item.post.visibility),

                              user: item.post.user
                                  ? {
                                        ...item.post.user,
                                        ...(originalPostUserImageUrl && {
                                            image: originalPostUserImageUrl,
                                        }),
                                    }
                                  : item.post.user,
                          },
                      }
                    : {}),
            };
        }),
    );

    return { metadata: { hasMore, nextCursor }, posts: feed };
};

export const storePostService = async (req: Request): Promise<PostInterface> => {
    const { files, visibility } = req.body;

    let updatedFiles = await handleS3Files(files, "public/posts/");

    const post = await storePostRepo({ ...req.body, files: updatedFiles, user: req.user?._id });

    let finalPost = { ...post };

    if (updatedFiles.length > 0) {
        const resolvedFiles = await resolveFiles(updatedFiles, visibility);
        finalPost = { ...post, files: resolvedFiles };
    }

    const user = finalPost.user;
    if (user?.image) {
        const resolvedImage = await resolveFiles([{ s3Key: user.image }], "public");

        user.image = resolvedImage[0].url;
    }

    return finalPost;
};

export const repostPostService = async (req: Request): Promise<boolean> => {
    return await repostPostRepo({ ...req.body }, req.user?._id);
};

export const updatePostService = async (req: Request): Promise<PostInterface> => {
    const { files, visibility } = req.body;

    let updatedFiles = await handleS3Files(files, "public/posts/");

    const post = await updatePostRepo({ ...req.body, files: updatedFiles, ...req.params });

    let finalPost = { ...post };

    if (updatedFiles.length > 0) {
        const resolvedFiles = await resolveFiles(updatedFiles, visibility);
        finalPost = { ...post, files: resolvedFiles };
    }

    const user = finalPost.user;
    if (user?.image) {
        const resolvedImage = await resolveFiles([{ s3Key: user.image }], "public");

        user.image = resolvedImage[0].url;
    }

    return finalPost;
};

export const likePostService = async (req: Request): Promise<boolean> => {
    return await likePostRepo(req.params._id as string, req.user?._id);
};

export const deletePostService = async (req: Request): Promise<void> => {
    await deletePostRepo(req.params._id as string);
};
