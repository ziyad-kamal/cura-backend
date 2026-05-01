/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Post from "../app/models/Post.ts";
import { PostInterface } from "../interfaces/models/PostInterface.ts";

const seedPosts = async (
    count: number = 30,
    userIds: Array<Types.ObjectId> = [],
):Promise<PostInterface[]> => {
    try {
        await Post.deleteMany({});
        console.log("🗑️  Cleared existing posts");

        if (userIds.length === 0) {
            throw new Error("No user IDs provided for posts");
        }

        const posts = [];
        const image = faker.image.urlPicsumPhotos({
            width: 800,
            height: 600,
        });

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            posts.push({
                visibility: faker.helpers.arrayElement(['public','private']),
                content: faker.lorem.paragraphs({ min: 2, max: 5 }),
                userId: faker.helpers.arrayElement(userIds),
                files: [{url:image,type:'image'},{url:image,type:'image'}],
                tags: faker.helpers.arrayElements([ "ارتفاع ضغط الدم", "انخفاض ضغظ الدم", "زيادة الوزن"], { min: 1, max: 3 }),
                createdAt: randomDate,
                updatedAt: randomDate,
            });
        }

        const createdPosts = await Post.insertMany(posts);
        console.log(`✅ Created ${createdPosts.length} posts`);

        return createdPosts;
    } catch (err: unknown) {
        console.error(
            "Posts seeding failed:",
            err instanceof Error ? err.message : String(err),
        );

        throw err;
    }
};

export default seedPosts;
