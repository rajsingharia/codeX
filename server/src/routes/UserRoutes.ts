import express from 'express';
import * as UserController from '../controller/UserController';

const userRouter = express.Router();

userRouter.get('/get-user', UserController.getUser);

userRouter.post('/update-user', UserController.updateUser);

export default userRouter;