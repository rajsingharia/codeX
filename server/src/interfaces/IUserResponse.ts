import { Document, ObjectId } from "mongoose";

export default interface IUserResponse{
    userId: string,
    name: string,
    email: string,
}