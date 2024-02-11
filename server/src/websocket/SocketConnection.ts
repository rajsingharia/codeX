import { Socket } from "socket.io";
import Websocket from "./WebSocket";
import createHttpError from "http-errors";
import Redis from "ioredis";
import KafkaProducer from "../service/kafkaProducerService";

class SocketManager {
  private io: Websocket;
  private socketMap: Map<string, Socket>;
  private redisSubscriber: Redis;
  private redisPublisher: Redis;
  private roomToUserAndCursorMapping: Map<string, Map<string, { lineNumber: number, column: number }>>;
  private kafkaProducer: KafkaProducer;

  constructor(io: Websocket, socketMap: Map<string, Socket>) {
    this.io = io;
    this.socketMap = socketMap;
    this.redisSubscriber = new Redis();
    this.redisPublisher = new Redis();
    this.roomToUserAndCursorMapping = new Map();
    this.kafkaProducer = new KafkaProducer();
  }

  handleConnection(socket: Socket) {
    socket.on("join-room", (data: { roomId: string }) => {
      const roomId = data.roomId;
      const userId = socket.data.userId as string;

      if (!userId) throw createHttpError(401, "Unauthorized to connect to socket!");

      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected", userId);
      this.socketMap.set(userId, socket);

      // Subscribe to the Redis channels for this room
      this.redisSubscriber.subscribe(`code_changes_${roomId}`);
      this.redisSubscriber.subscribe(`cursor_changes_${roomId}`);

      // Listen for code changes and cursor movements from Redis and broadcast to room
      this.redisSubscriber.on('message', (channel, message) => {
        const { userId: senderId, delta, cursor } = JSON.parse(message) as {
          userId: string,
          delta: any,
          cursor: { lineNumber: number, column: number }
        };

        if (senderId !== userId) {
          socket.emit("receive-code-changes", delta);
        }

        // Emit cursor position to the room
        socket.broadcast.to(roomId).emit("receive-cursor-position", { userId: senderId, cursor });
      });

      socket.on("disconnect", () => {
        socket.broadcast.to(roomId).emit("user-disconnected", userId);
        this.socketMap.delete(userId);

        // Unsubscribe from the Redis channels when user disconnects
        this.redisSubscriber.unsubscribe(`code_changes_${roomId}`);
        this.redisSubscriber.unsubscribe(`cursor_changes_${roomId}`);
      });
    });

    socket.on('send-code-changes', ({ delta, roomId, cursor }: { delta: any, roomId: string, cursor: { lineNumber: number, column: number } }) => {
      // Publish code changes and cursor position to Redis channels for this room
      this.redisPublisher.publish(`code_changes_${roomId}`, JSON.stringify({ userId: socket.data.userId, delta, cursor }));
      this.redisPublisher.publish(`cursor_changes_${roomId}`, JSON.stringify({ userId: socket.data.userId, cursor }));

      // Produce code changes to Kafka topic
      this.kafkaProducer.produceCodeChanges(roomId, socket.data.userId, delta);
    });

    socket.on("send-cursor-position", (cursor: { lineNumber: number, column: number }) => {
      const roomId = socket.data.roomId as string;
      const userId = socket.data.userId as string;

      let currentUserAndCursorMapping = this.roomToUserAndCursorMapping.get(roomId);

      if (!currentUserAndCursorMapping) {
        currentUserAndCursorMapping = new Map();
        this.roomToUserAndCursorMapping.set(roomId, currentUserAndCursorMapping);
      }

      currentUserAndCursorMapping.set(userId, cursor);

      // Broadcast the updated cursor positions to the room
      socket.broadcast.to(roomId).emit("receive-cursor-position", currentUserAndCursorMapping);

      // Publish cursor position to Redis channel
      this.redisPublisher.publish(`cursor_changes_${roomId}`, JSON.stringify({ userId, cursor }));
    });
  }

  start() {
    this.io.on("connection", (socket: Socket) => {
      this.handleConnection(socket);
    });
  }
}

export default SocketManager;
