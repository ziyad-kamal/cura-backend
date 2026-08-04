/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Like from '../app/models/Like.js';
const seedLikes = async (countPerComment = 8, countPerPost = 8, postIds = [], commentIds = [], userIds = []) => {
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
                    user: faker.helpers.arrayElement(userIds),
                    post: postId,
                });
            }
        }
        for (const commentId of commentIds) {
            for (let i = 0; i < countPerComment; i++) {
                likes.push({
                    user: faker.helpers.arrayElement(userIds),
                    post: faker.helpers.arrayElement(postIds),
                    commentId,
                });
            }
        }
        const createdLikes = await Like.insertMany(likes);
        console.log(`✅ Created ${createdLikes.length} likes`);
        return createdLikes;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedLikes;
//# sourceMappingURL=likeSeeder.js.map