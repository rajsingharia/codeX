import { NextFunction, RequestHandler } from "express";
import jwt, { JwtPayload, Secret, VerifyOptions } from "jsonwebtoken"
import config from '../config'
import createHttpError from "http-errors";
import { Socket } from "socket.io";
import { ExtendedError } from "socket.io/dist/namespace";


const verifyTokenFromHeader: RequestHandler = (req, res, next) => {
    try {
        //let BearerString = req.headers["authorization"];
        //if (!BearerString) throw createHttpError(403, "No token provided!");
        //let token = BearerString.split(" ")[1];
        //if (!token) throw createHttpError(403, "No token provided!");
        let token = req.cookies?.accessToken ?? undefined;
        if (!token) throw createHttpError(403, "No token provided!");

        jwt.verify(token,
            config.secret,
            (err: any, payload: any) => {
                if (err) throw createHttpError(401, "Unauthorized!");
                const userId = (payload && payload.userId) ? payload.userId : undefined;
                req.body.userId = userId;
                next();
            });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

const verifyTokenFromSocket = (socket: Socket, next: (err?: ExtendedError | undefined) => void) => {
    try {
        let token = socket.handshake.auth.token;
        if (!token) throw createHttpError(403, "No token provided!");
        jwt.verify(token,
            config.secret,
            (err: any, payload: any) => {
                if (err) throw createHttpError(401, "Unauthorized to connect to socket!");
                const userId = (payload && payload.userId) ? payload.userId : undefined;
                socket.data.userId = userId;
                next();
            });
    } catch (err) {
        const errorMessage = (err instanceof Error) ? err.message : "An unknown error occured";
        console.log(errorMessage);
        const error = new Error(errorMessage) as ExtendedError;
        next(error);
    }
};

export { verifyTokenFromHeader, verifyTokenFromSocket };