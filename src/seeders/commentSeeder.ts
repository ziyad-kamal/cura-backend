/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Comment from "../app/models/Comment.ts";

const seedComments = async (
    countPerPost: number = 8,
    postIds: Array<Types.ObjectId> = [],
    userIds: Array<Types.ObjectId> = [],
) => {
    try {
        await Comment.deleteMany({});
        console.log("🗑️  Cleared existing comments");

        if (postIds.length === 0 || userIds.length === 0) {
            throw new Error("No post/user IDs provided for comments");
        }

        const comments = [];

        for (const postId of postIds) {
            const randomDate = faker.date.past({ years: 1 });

            for (let i = 0; i < countPerPost; i++) {
                comments.push({
                    content: faker.lorem.paragraph({ min: 1, max: 3 }),
                    author: faker.helpers.arrayElement(userIds),
                    post: postId,
                    createdAt: randomDate,
                    updatedAt: randomDate,
                });
            }
        }

        const created = await Comment.insertMany(comments);
        console.log(`✅ Created ${created.length} comments`);

        return created;
    } catch (err: unknown) {
        console.error(
            "Posts seeding failed:",
            err instanceof Error ? err.message : String(err),
        );
        throw err;
    }
};

export default seedComments;
