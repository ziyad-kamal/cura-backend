import { Socket } from "socket.io";

export interface SocketDataInterface extends Socket {
    userId?: string;
}
