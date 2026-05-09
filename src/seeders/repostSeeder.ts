/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Repost from '../app/models/Repost.js';
import { RepostInterface } from '../interfaces/models/RepostInterface.js';

const seedReposts = async (
    countPerPost: number = 8,
    postIds: Array<Types.ObjectId> = [],
    userIds: Array<Types.ObjectId> = [],
):Promise<RepostInterface[]> => {
    try {
        await Repost.deleteMany({});
        console.log("🗑️  Cleared existing reposts");

        if (postIds.length === 0 || userIds.length === 0) {
            throw new Error("No post/user IDs provided for reposts");
        }

        const reposts = [];

        for (const postId of postIds) {
            for (let i = 0; i < countPerPost; i++) {
                reposts.push({
                    content: faker.lorem.paragraphs({ min: 2, max: 5 }),
                    user: faker.helpers.arrayElement(userIds),
                    post:postId,
                });
            }
        }

        const createdReposts = await Repost.insertMany(reposts);
        console.log(`✅ Created ${createdReposts.length} reposts`);

        return createdReposts;
    } catch (err: unknown) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};

export default seedReposts;
