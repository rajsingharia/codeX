import { Schema, model } from 'mongoose';

// 1. Create an interface representing a document in MongoDB.
import {IUserDoc} from '../interfaces/IUser'

// 2. Create a Schema corresponding to the document interface.
const userSchema = new Schema<IUserDoc>({
  name: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true }
}, { timestamps: true });

// 3. Create a Model.
const UserModel = model<IUserDoc>("User", userSchema);

export default UserModel;