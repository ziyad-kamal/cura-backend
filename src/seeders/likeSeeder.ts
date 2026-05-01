/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Like from "../app/models/Like.ts";
import { LikeInterface } from "../interfaces/models/LikeInterface.ts";

const seedLikes = async (
    countPerComment: number = 8,
    countPerPost: number = 8,
    postIds: Array<Types.ObjectId> = [],
    commentIds: Array<Types.ObjectId> = [],
    userIds: Array<Types.ObjectId> = [],
):Promise<LikeInterface[]> => {
    try {
        await Like.deleteMany({});
        console.log("🗑️  Cleared existing likes");

        if (postIds.length === 0 || userIds.length === 0) {
            throw new Error("No post/user IDs provided for likes");
        }

        const likes = [];

        for (const postId of postIds) {
            for (let i = 0; i < countPerPost; i++) {
                likes.push({
                    userId: faker.helpers.arrayElement(userIds),
                    postId,
                    type:'post',
                });
            }
        }

        for (const commentId of commentIds) {
            for (let i = 0; i < countPerComment; i++) {
                likes.push({
                    userId: faker.helpers.arrayElement(userIds),
                    postId: faker.helpers.arrayElement(postIds),
                    commentId,
                    type: "post",
                });
            }
        }

        const createdLikes = await Like.insertMany(likes);
        console.log(`✅ Created ${createdLikes.length} likes`);

        return createdLikes;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedLikes;
