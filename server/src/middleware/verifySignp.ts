import { RequestHandler } from "express";
import UserModel from "../models/User"
import createHttpError from "http-errors";


const checkDuplicateEmail: RequestHandler = async (req, res, next) => {
    const email = req.body.email
    try {
        const user = await UserModel.findOne({ email: email });
        if(user) throw createHttpError(400, "User already exists");
        next();
    } catch (error) {
        next(error);
    }
}

export default checkDuplicateEmail;