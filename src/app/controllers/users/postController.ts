import { Request, Response } from "express";

import { indexPostsService, storePostService } from "../../services/users/postService.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { returnSuccess } from "../../utils/returnJson.js";

export const index = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const posts = await indexPostsService(req);
    return returnSuccess(res, "", 200, posts);
});

export const store = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await storePostService(req);
    return returnSuccess(res, "", 200, { post });
});

// const storePosts = asyncHandler(async (req: PostRequestInterface, res: Response) => {
    // const session = await mongoose.startSession();
    // const filePath = await uploadImage(req, "public/images", 300);
    // let post;
    // await redisClient.set("test", "test", { EX: 2 * 60 * 60 });
    // await redisClient.get("test");
    // log.info(req, res, "post is created");
    // await sendEmail({
    //     to: "test@example.com",
    //     subject: "Test Email from Express + TS",
    //     templateName: "test",
    //     context: {
    //         name: "ziyad",
    //         verificationLink: "link/sdf",
    //     },
    // });
    // await session.withTransaction(async () => {
    // const { title, content, author } = req.body;
    // [post] = await Post.create([{ title, content, filePath, author }], { session });
    // await post.updateOne({ title: "updated" }, { session });
    // });
    // await session.endSession();
    // return returnSuccess(res, "you created post successfully", 201, post);
// });

// export { getPosts, showPost, storePosts };
