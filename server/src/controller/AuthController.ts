import { RequestHandler } from "express"
import createHttpError from "http-errors";
import * as AuthService from "../service/AuthService"


interface SignUpBody {
    name?: string,
    email?: string,
    password?: string
}

export const registerUser: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {

    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    try {
        if (!name) throw createHttpError(400, "name not provided");
        if (!email) throw createHttpError(400, "email is empty");
        if (!password) throw createHttpError(400, "password is empty");
        var user = await AuthService.registerUser(req.body);
        res.status(200).send({
            message: "User was registered successfully!",
            user
        });
    } catch (error) {
        next(error);
    }
}


interface SignInBody {
    email?: string,
    password?: string
}


export const loginUser: RequestHandler<unknown, unknown, SignInBody, unknown> = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    try {
        console.log("email", email);
        if (!email) throw createHttpError(400, "email is empty");
        if (!password) throw createHttpError(400, "password is empty");
        const user = await AuthService.loginUser(email, password);
        console.log("user", user);
        const accessToken = await AuthService.generateToken(user);
        res.status(200).send({
            message: "User was logged in successfully!",
            user,
            accessToken
        });
    } catch (error) {
        next(error);
    }
}

export const getAllUsers: RequestHandler = async (req, res, next) => {
    try {
        const users = await AuthService.getAllUsers();
        res.status(200).send({
            message: "All users",
            users
        });
    } catch (error) {
        next(error);
    }
}