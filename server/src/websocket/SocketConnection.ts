import { Socket } from "socket.io";
import Websocket from "./WebSocket";
import createHttpError from "http-errors";

export default function getSocketConnectionReady(io: Websocket, socketMap: Map<String, Socket>) {
    //const roomToUserAndCursorMapping = new Map<String, Map<String, { lineNumber: number,column: number }>>();
    io.on("connection", (socket: Socket) => {
        socket.on("join-room", (data) => {
            const roomId = data.roomId;
            const userId = socket.data.userId;
            if (!userId) throw createHttpError(401, "Unauthorized to connect to socket!");
            socket.join(roomId);
            socket.broadcast.to(roomId).emit("user-connected", userId);
            socketMap.set(userId, socket);
            socket.on("disconnect", () => {
                socket.broadcast.to(roomId).emit("user-disconnected", userId);
                socketMap.delete(userId);
            });
        });

        socket.on('send-code-changes', ({delta, roomId}) => {
            // send code changes to all users in the room except the sender
            socket.broadcast.to(roomId).emit("receive-code-changes", delta);
        });

        // socket.on("send-cursor-position", (cursor, roomId, userId) => {
        //     const currentUserAndCursorMapping = roomToUserAndCursorMapping.get(roomId);
        //     if (currentUserAndCursorMapping && currentUserAndCursorMapping.has(userId)) {
        //         currentUserAndCursorMapping.set(userId, cursor);
        //     } else {
        //         const newUserAndCursorMapping = new Map<String, { lineNumber: number,column: number }>();
        //         newUserAndCursorMapping.set(userId, cursor);
        //         roomToUserAndCursorMapping.set(roomId, newUserAndCursorMapping);
        //     }
        //     socket.broadcast.to(roomId).emit("receive-cursor-position", currentUserAndCursorMapping?.get(roomId));
        // });
    });
}