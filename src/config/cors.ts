import cors from "cors";
import "dotenv/config";

const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000",
    "doo5n7tiet2x7.cloudfront.net",
    process.env.CLIENT_URL,
].filter(Boolean) as string[];

// export const applyCors = cors({
//     origin: (origin, callback) => {
//         if (!origin) return callback(null, true);

//         if (allowedOrigins.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error(`CORS blocked: ${origin}`));
//         }
//     },
//     credentials: true,
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
//     allowedHeaders: ["Content-Type", "Authorization"],
// });

export const applyCors = cors({
    origin: process.env.NODE_ENV === "production" ? allowedOrigins : (origin, callback) => callback(null, true),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization", "x-refresh-token"],
});
