import { Socket } from "socket.io";
import Websocket from "./WebSocket";
import createHttpError from "http-errors";
import Redis, { RedisOptions } from "ioredis";
import KafkaProducer from "../service/kafkaProducerService";

class SocketManager {
  private io: Websocket;
  private redisSubscriber: Redis;
  private redisPublisher: Redis;
  private kafkaProducer: KafkaProducer;
  private redisConnection: RedisOptions = { host: 'redis', port: 6379 } as const

  constructor(io: Websocket, socketMap: Map<string, Socket>) {
    this.io = io;
    this.redisSubscriber = new Redis(this.redisConnection);
    this.redisPublisher = new Redis(this.redisConnection);
    this.kafkaProducer = new KafkaProducer();
  }

  async getCursorPositions(roomId: string) {
    const cursorPosition = await this.redisSubscriber.hgetall(`cursor_positions:${roomId}`);
    const result = new Map()
    for(const userId in cursorPosition) {
      result.set(userId, JSON.parse(cursorPosition[userId]))
    }
    return result
  }

  handleConnection(socket: Socket) {
    socket.on("join-room", (data: { roomId: string }) => {
      const roomId = data.roomId;
      const userId = socket.data.userId as string;

      if (!userId) throw createHttpError(401, "Unauthorized to connect to socket!");

      socket.join(roomId);
      socket.broadcast.to(roomId).emit("user-connected", userId);

      this.redisSubscriber.subscribe(`code_changes_${roomId}`);
      this.redisSubscriber.subscribe(`cursor_changes_${roomId}`);

      this.redisSubscriber.on('message', (channel, message) => {

        if (channel.startsWith('code_changes_')) {
          const { delta } = JSON.parse(message)
          socket.broadcast.to(roomId).emit("receive-code-changes", delta);
        }

        else if (channel.startsWith(`cursor_changes_`)) {
          let currentUserAndCursorMapping = this.getCursorPositions(roomId)
          socket.broadcast.to(roomId).emit("receive-cursor-position", currentUserAndCursorMapping);
        }

      });

      socket.on("disconnect", () => {
        socket.broadcast.to(roomId).emit("user-disconnected", userId);
        this.redisSubscriber.unsubscribe(`code_changes_${roomId}`);
        this.redisSubscriber.unsubscribe(`cursor_changes_${roomId}`);
      });
    });

    socket.on('send-code-changes', ({ delta, roomId }: { delta: any, roomId: string }) => {
      this.redisPublisher.publish(`code_changes_${roomId}`, JSON.stringify({ delta }));
      this.kafkaProducer.produceCodeChanges(roomId, socket.data.userId, delta);
    });

    socket.on("send-cursor-position", (roomId, cursor: { lineNumber: number, column: number }) => {
      const userId = socket.data.userId as string;
      this.redisPublisher.hset(`cursor_positions${roomId}`, userId, JSON.stringify(cursor))
      this.redisPublisher.publish(`cursor_changes_${roomId}`, JSON.stringify({ userId }));
    });
  }

  start() {
    this.io.on("connection", (socket: Socket) => {
      this.handleConnection(socket);
    });
  }
}

export default SocketManager;
