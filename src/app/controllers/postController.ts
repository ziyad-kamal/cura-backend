import { Request, Response } from "express";
import { PostRequestInterface } from "../../interfaces/requests/PostRequestInterface.ts";
import Post from "../models/Post.ts";
import { getPosts } from "../services/postService.ts";
import { asyncHandler } from "../utils/asyncHandler.ts";
import { returnSuccess } from "../utils/returnJson.ts";
import uploadImage from "../utils/uploadImage.ts";

const getPostsController = async (req: Request, res: Response): Promise<Response> => {
    const data = await getPosts(req);

    return returnSuccess(res, "", 200, data);
};

const storePosts = asyncHandler(async (req: PostRequestInterface, res: Response): Promise<Response> => {
    const filePath = await uploadImage(req, "public/images", 300);
    const { title, content, author } = req.body;

    const post = await Post.create({ title, content, filePath, author });

    return returnSuccess(res, "you created post successfully", 201, post);
});

export { getPostsController, storePosts };
