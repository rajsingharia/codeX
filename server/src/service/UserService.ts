import createHttpError from "http-errors";
import UserModel from "../models/User";


export const getUserById = async(userId: string) => {
    const user = await UserModel.findOne({_id: userId});
    if(!user) throw createHttpError(404, "user not found");
    return user;
}


export function getUserByEmail(email: string) {
    const user = UserModel.findOne({email: email});
    if(!user) throw createHttpError(404, "user not found");
    return user;
}

