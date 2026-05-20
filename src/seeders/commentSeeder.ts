/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Comment from '../app/models/Comment.js';

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
                    content: faker.lorem.paragraph({ min: 1, max: 2 }),
                    user: faker.helpers.arrayElement(userIds),
                    post: postId,
                    createdAt: randomDate,
                    updatedAt: randomDate,
                    repost: postId,
                });
            }
        }

        const createdComments = await Comment.insertMany(comments);
        console.log(`✅ Created ${createdComments.length} comments`);

        return createdComments;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedComments;
