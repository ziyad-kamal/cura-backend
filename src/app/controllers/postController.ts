import { Request, Response } from "express";
import { PostRequestInterface } from "../../interfaces/requests/PostRequestInterface.ts";
import NotFoundError from "../errors/NotFoundError.ts";
import Post from "../models/Post.ts";
import { getPostsService } from "../services/postService.ts";
import { asyncHandler, returnSuccess } from "../utils/index.ts";

const getPosts = async (req: Request, res: Response): Promise<Response> => {
    const data = await getPostsService(req);

    return returnSuccess(res, "", 200, data);
};

const showPost = asyncHandler(async (req: Request, res: Response): Promise<Response> => {
    const post = await Post.findById(req.params.postId);

    if (!post) {
        throw new NotFoundError("not found post", 404);
    }

    return returnSuccess(res, "", 200, post);
});

const storePosts = asyncHandler(async (req: PostRequestInterface, res: Response) => {
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
});

export { getPosts, showPost, storePosts };
