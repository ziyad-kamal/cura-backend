import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { jwtConfig } from "./jwt.js";
import { getChatroomRepo } from "../app/repositories/users/consultation/chatroomRepo.js";
import { markMessageAsReadRepo, storeMessageRepo } from "../app/repositories/users/consultation/messageRepo.js";
import { RedisService } from "../app/services/users/consultation/onlineUserService.js";
import { handleS3Files } from "../app/utils/handleS3Files.js";
import { resolveFiles } from "../app/utils/resolveFiles.js";
export const initSocket = (httpServer) => {
    const io = new Server(httpServer, {
        cors: {
            origin: [
                "http://localhost:5173",
                "http://ec2-16-112-217-167.ap-south-2.compute.amazonaws.com",
                "http://localhost:4000",
                'https://cura.ecocity.info',
            ],
            methods: ["GET", "POST"],
            credentials: true,
        },
    });
    // authenticate socket connection
    io.use((socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error: token missing"));
        }
        try {
            const decoded = jwt.verify(token, jwtConfig.accessTokenSecret);
            socket.senderId = decoded._id;
            next();
        }
        catch (_a) {
            next(new Error("Authentication error: invalid token " + token));
        }
    });
    io.on("connection", async (socket) => {
        const senderId = socket.senderId;
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
            var _a;
            try {
                if (!(content === null || content === void 0 ? void 0 : content.trim()) && (files === null || files === void 0 ? void 0 : files.length) === 0)
                    return;
                const chatroom = await getChatroomRepo(receiverId, senderId);
                const chatroomId = String(chatroom._id);
                const updatedFiles = await handleS3Files(files, "chats/");
                const message = await storeMessageRepo(receiverId, senderId, content, updatedFiles, chatroomId);
                let finalMessage = Object.assign({}, message);
                if (updatedFiles.length > 0) {
                    const resolvedFiles = await resolveFiles(updatedFiles, "private");
                    finalMessage = Object.assign(Object.assign({}, message), { files: resolvedFiles });
                }
                const senderObj = finalMessage.sender;
                if ((senderObj === null || senderObj === void 0 ? void 0 : senderObj.image) && !senderObj.image.startsWith("http")) {
                    const resolvedSenderImg = await resolveFiles([{ s3Key: senderObj.image }], "public");
                    senderObj.image = ((_a = resolvedSenderImg[0]) === null || _a === void 0 ? void 0 : _a.url) || senderObj.image;
                }
                io.to(receiverId).emit("message:receive", finalMessage);
                socket.emit("message:sent", finalMessage);
            }
            catch (err) {
                socket.emit("message:error", { msg: String(err) });
            }
        });
        // mark messages as read
        socket.on("message:read", async ({ chatroomId, senderId }) => {
            try {
                await markMessageAsReadRepo(chatroomId);
                // notify sender that messages were read
                io.to(senderId).emit("message:read:ack", { chatroomId });
            }
            catch (err) {
                socket.emit("message:error", err);
            }
        });
        // typing indicator
        socket.on("typing:start", ({ receiverId }) => {
            io.to(receiverId).emit("typing:start", { senderId });
        });
        socket.on("typing:stop", ({ receiverId }) => {
            io.to(receiverId).emit("typing:stop", { senderId });
        });
    });
    return io;
};
//# sourceMappingURL=socket.js.map