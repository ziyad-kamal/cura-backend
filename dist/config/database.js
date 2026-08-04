/* eslint-disable no-console */
import "dotenv/config";
import mongoose from "mongoose";
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully! ✓");
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        console.error("MongoDB connection failed:", errorMessage);
        process.exit(1);
    }
};
export default connectDB;
//# sourceMappingURL=database.js.map