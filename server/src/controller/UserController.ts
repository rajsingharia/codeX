import { RequestHandler } from "express";
import UserModel from "../models/User";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import * as UserService from '../service/UserService'

interface UpdateUserBody {
    name?: string,
    email?: string
}

interface GetUserBody {
    userId?: string
}


export const getUser: RequestHandler<unknown, unknown, GetUserBody, unknown> = async (req, res, next) => {
    const userId = req.body.userId;
    try {
        if(!userId) throw createHttpError(401, "userId not found with request");
        if(!mongoose.isValidObjectId(userId)) throw createHttpError(400, "Invalid userId");
        const user = await UserService.getUserById(userId);
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}


//any->unsafe, unknown->restrictive
export const updateUser: RequestHandler<unknown, unknown, UpdateUserBody, unknown> = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    try {
        if(!name) throw createHttpError(400, "name not found with request");
        if(!email) throw createHttpError(400, "email not found with request");
        
        const newUser = await UserModel.create({
            name: name,
            email: email
        });

        res.send(201).json(newUser)
    } catch (error) {
        next(error)
    }
}

