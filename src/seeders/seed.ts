/* eslint-disable no-console */
import { Types } from "mongoose";
import { connectDB } from "../config/index.js";
import { UserInterface } from "../interfaces/models/UserInterface.js";
import { seedComments, seedPosts, seedUsers } from "./index.js";
import seedLikes from "./likeSeeder.js";
import { CommentInterface } from "../interfaces/models/CommentInterface.js";
import seedReposts from "./repostSeeder.js";

const seedAll = async () => {
    try {
        await connectDB();

        console.log("🌱 Starting database seeding...");

        const createdUsers = await seedUsers(20);
        const userIds = createdUsers
            .map((user: UserInterface) => user._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        const createdPosts = await seedPosts(userIds);
        const postIds = createdPosts.map((post) => post._id).filter((id): id is Types.ObjectId => id !== undefined);
        
        const createdComments = await seedComments(30, postIds, userIds);
        const commentIds = createdComments
            .map((comment: CommentInterface) => comment._id)
            .filter((id): id is Types.ObjectId => id !== undefined);

        await seedLikes(10, 10, postIds, commentIds, userIds);
        await seedReposts(10, postIds, userIds);

        console.log("🎉 Database seeding completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedAll();
