/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import Post from '../app/models/Post.js';
import { PostVisibility } from "../enums/PostVisibility.js";
import { PostTag } from "../enums/PostTag.js";
const seedPosts = async (userIds = []) => {
    try {
        await Post.deleteMany({});
        console.log("🗑️  Cleared existing posts");
        if (userIds.length === 0) {
            throw new Error("No user IDs provided for posts");
        }
        const posts = [];
        for (let userId of userIds) {
            const randomDate = faker.date.past({ years: 1 });
            posts.push({
                visibility: faker.helpers.arrayElement(Object.values(PostVisibility)),
                content: faker.lorem.paragraphs({ min: 2, max: 5 }),
                user: userId,
                files: [
                    { s3Key: 'staging/039d157188b33ce23e5b96def8bf2093.png', type: "image" },
                    { s3Key: 'staging/039d157188b33ce23e5b96def8bf2093.png', type: "image" },
                ],
                tags: faker.helpers.arrayElements(Object.values(PostTag), { min: 1, max: 2 }),
                createdAt: randomDate,
                updatedAt: randomDate,
            });
        }
        const createdPosts = await Post.insertMany(posts);
        console.log(`✅ Created ${createdPosts.length} posts`);
        return createdPosts;
    }
    catch (err) {
        console.error("Posts seeding failed:", err instanceof Error ? err.message : String(err));
        throw err;
    }
};
export default seedPosts;
//# sourceMappingURL=postSeeder.js.map