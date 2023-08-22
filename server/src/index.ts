import express, { NextFunction, Request, Response } from 'express';
import codeEditorRouter from './routes/CodeEditorRoutes'
import authRouter from './routes/AuthRoutes';
import userRouter from './routes/UserRoutes';
import cookieParser from 'cookie-parser';

import { verifyTokenFromHeader, verifyTokenFromSocket} from './middleware/authJwt';
import morgan from 'morgan'
import createHttpError, {isHttpError} from "http-errors"
import WebSocket from './websocket/WebSocket'
import { createServer } from 'http';
import cors from 'cors';
import { Socket } from 'socket.io';
import getSocketConnectionReady from './websocket/SocketConnection';
import connectToDb from './db/mongoDB';
import { ExtendedError } from 'socket.io/dist/namespace';
import publicCodeEditorRouter from './routes/PublicCodeEditorRoutes';

const app = express();
const httpServer = createServer(app);
const io = WebSocket.getInstance(httpServer);
const socketMap = new Map<string, Socket>();

app.use(morgan("dev"));
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true} ));
app.use(cookieParser());
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token, Origin, Content-Type, Accept"
  );
  next();
});

//verify token from socket connection
io.use((socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
  verifyTokenFromSocket(socket, next);
});
getSocketConnectionReady(io, socketMap);

//connect to mongoDB
connectToDb();

//routes
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/code-editor', verifyTokenFromHeader, codeEditorRouter);
app.use('/api/v1/public/code-editor', publicCodeEditorRouter)
app.use('/api/v1/user', verifyTokenFromHeader, userRouter);

//if any page is not found
app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint not found"));
});

//error handeling
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  let errorMessage = "An unknown error occured";
  let statusCode = 500
  if(isHttpError(error)) {
    errorMessage = error.message;
    statusCode = error.status;
  }
  res.status(statusCode).json({error: errorMessage});
});

httpServer.listen(5000,() => {
    console.log('Server is running on port 5000');
});