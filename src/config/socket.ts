import { Server as HttpServer } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import { jwtConfig } from "./jwt.js";
import { getChatroomRepo } from "../app/repositories/users/consultation/chatroomRepo.js";
import { markMessageAsReadRepo, storeMessageRepo } from "../app/repositories/users/consultation/messageRepo.js";
import { RedisService } from "../app/services/users/consultation/onlineUserService.js";
import { handleS3Files } from "../app/utils/handleS3Files.js";
import { resolveFiles } from "../app/utils/resolveFiles.js";
import { UserInterface } from "../interfaces/models/UserInterface.js";

export const initSocket = (httpServer: HttpServer): Server => {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://ec2-16-112-217-167.ap-south-2.compute.amazonaws.com",
                "http://localhost:4000",
                "doo5n7tiet2x7.cloudfront.net",
            ],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    // authenticate socket connection
    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth.token as string;

        if (!token) {
            return next(new Error("Authentication error: token missing"));
        }

        try {
            const decoded = jwt.verify(token, jwtConfig.accessTokenSecret) as JwtPayload;
            (socket as Socket & { senderId: string }).senderId = decoded._id as string;
            next();
        } catch {
            next(new Error("Authentication error: invalid token"));
        }
    });

    io.on("connection", async (socket: Socket) => {
        const senderId = (socket as Socket & { senderId: string }).senderId;

        await RedisService.setUserOnline(senderId, 60);

        // 2. Broadcast to other active channels that this user came online
        socket.broadcast.emit("user:online", { senderId });

        // 3. Optional: Setup a recurring heartbeat interval from client to keep TTL alive
        socket.on("heartbeat", async () => {
            await RedisService.setUserOnline(senderId, 60);
        });

        // 4. Handle Disconnection
        socket.on("disconnect", async () => {
            // Remove user from active status
            await RedisService.setUserOffline(senderId);

            // Broadcast status change across the network cluster
            socket.broadcast.emit("user:offline", { senderId });
        });

        // join personal room for direct messages
        socket.join(senderId);

        // send message
        socket.on("message:send", async ({ receiverId, content, files }) => {
            try {

                if (!content?.trim() && files?.length === 0) return;

                const chatroom = await getChatroomRepo(receiverId, senderId);
                const chatroomId = String(chatroom._id);

                const updatedFiles = await handleS3Files(files, "chats/");

                const message = await storeMessageRepo(receiverId, senderId, content, updatedFiles, chatroomId);

                let finalMessage = { ...message };
                if (updatedFiles.length > 0) {
                    const resolvedFiles = await resolveFiles(updatedFiles, "private");
                    finalMessage = { ...message, files: resolvedFiles };
                }

                const senderObj = finalMessage.sender as UserInterface;

                if (senderObj?.image && !senderObj.image.startsWith("http")) {
                    const resolvedSenderImg = await resolveFiles([{ s3Key: senderObj.image }], "public");
                    senderObj.image = resolvedSenderImg[0]?.url || senderObj.image;
                }

                io.to(receiverId).emit("message:receive", finalMessage);
                socket.emit("message:sent", finalMessage);
            } catch (err) {
                socket.emit("message:error", { msg: String(err) });
            }
        });

        // mark messages as read
        socket.on("message:read", async ({ chatroomId, senderId }: { chatroomId: string; senderId: string }) => {
            try {
                await markMessageAsReadRepo(chatroomId);

                // notify sender that messages were read
                io.to(senderId).emit("message:read:ack", { chatroomId });
            } catch (err) {
                socket.emit("message:error", err);
            }
        });

        // typing indicator
        socket.on("typing:start", ({ receiverId }: { receiverId: string }) => {
            io.to(receiverId).emit("typing:start", { senderId });
        });

        socket.on("typing:stop", ({ receiverId }: { receiverId: string }) => {
            io.to(receiverId).emit("typing:stop", { senderId });
        });
    });

    return io;
};
