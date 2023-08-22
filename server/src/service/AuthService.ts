import createHttpError from "http-errors";
import UserModel from "../models/User"
import bcrypt  from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../config";
import { IUser, IUserDoc } from "../interfaces/IUser";
import IUserResponse from "../interfaces/IUserResponse";

export const loginUser = async(email: string, password: string) => {
    try {
        const user: IUserDoc | null = await UserModel.findOne({email: email});
        if(!user) throw createHttpError(500, "ser notf found");
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) throw createHttpError(500, "wrong password");
        const createdUser: IUserResponse = {
            userId: user._id,
            name: user.name,
            email:  user.email
        }
        return createdUser;
    } catch(error) {
        let errorMessage = (error instanceof Error) ? error.message : "Something went wrong";
        throw createHttpError(500, errorMessage);
    }
}

interface SignUpBody {
    name?:string,
    email?:string,
    password?:string
}


export const registerUser = async(user: SignUpBody) => {
    try {
        if(!user.name || !user.email || !user.password) throw createHttpError(400, "missing fields");
        user.password = await bcrypt.hash(user.password, 8);
        const newUser = new UserModel(user);
        const savedUser: IUserDoc = await newUser.save();
        const userResponse: IUserResponse = {
            userId: savedUser._id,
            name: savedUser.name,
            email:  savedUser.email
        }
        return userResponse;
    } catch(error) {
        let errorMessage = (error instanceof Error) ? error.message : "Something went wrong";
        throw createHttpError(500, errorMessage);
    }
}


export const getAllUsers = async() => {
    try {
        const allUsers: IUserDoc[] | undefined = await UserModel.find().exec();
        if(!allUsers) throw createHttpError(501, 'All Users Not found');
        const allUserResponse: IUserResponse[] = [];
        allUsers.forEach((user: IUserDoc)=>{
            const userResponse: IUserResponse = {
                userId: user._id,
                name: user.name,
                email:  user.email
            }
            allUserResponse.push(userResponse);
        });
        return allUserResponse;
    } catch(error) {
        let errorMessage = (error instanceof Error) ? error.message : "Something went wrong";
        throw createHttpError(500, errorMessage);
    }
}


export const generateToken = async(user: IUserResponse) => {
    try {
        const token = jwt.sign(
            { 
                userId: user.userId,
            },
            config.secret,
            {
                algorithm: "HS256",
                expiresIn: 86400 // expires in 24 hours
            }
        )
        return token;
    } catch(error) {
        let errorMessage = (error instanceof Error) ? error.message : "Something went wrong";
        throw createHttpError(500, errorMessage);
    }
}

export const getUserIdFromToken = async(token: string) => {
    try {

        

    } catch(error) {
        throw createHttpError(500, "internal server error");
    }
}