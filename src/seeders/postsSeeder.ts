/* eslint-disable no-console */
import { faker } from "@faker-js/faker";
import { Types } from "mongoose";
import Post from "../app/models/Post.ts";

const seedPosts = async (
    count: number = 30,
    userIds: Array<Types.ObjectId> = [],
) => {
    try {
        await Post.deleteMany({});
        console.log("🗑️  Cleared existing posts");

        if (userIds.length === 0) {
            throw new Error("No user IDs provided for posts");
        }

        const posts = [];

        for (let i = 0; i < count; i++) {
            const randomDate = faker.date.past({ years: 1 });
            posts.push({
                title: faker.lorem.sentence({ min: 4, max: 10 }),
                content: faker.lorem.paragraphs({ min: 2, max: 5 }),
                author: faker.helpers.arrayElement(userIds),
                filePath: faker.image.urlPicsumPhotos({
                    width: 800,
                    height: 600,
                }),
                tags: faker.helpers.arrayElements(
                    [
                        "javascript",
                        "nodejs",
                        "react",
                        "mongodb",
                        "express",
                        "typescript",
                        "programming",
                    ],
                    { min: 1, max: 4 },
                ),
                likeCount: faker.number.int({ min: 0, max: 120 }),
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
