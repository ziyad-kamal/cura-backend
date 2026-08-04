/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Repost from '../app/models/Repost.js';
const seedReposts = async (countPerPost = 8, postIds = [], userIds = []) => {
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
                    post: postId,
                    createdAt: faker.date.past({ years: 1 }),
                });
            }
        }
        const createdReposts = await Repost.insertMany(reposts);
        console.log(`✅ Created ${createdReposts.length} reposts`);
        return createdReposts;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedReposts;
//# sourceMappingURL=repostSeeder.js.map