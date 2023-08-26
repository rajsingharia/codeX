import express from 'express';
import * as AuthController from '../controller/AuthController';
import checkDuplicateEmail from '../middleware/verifySignp'
import { verifyTokenFromHeader } from '../middleware/authJwt'

const authRouter = express.Router();

authRouter.post("/register", checkDuplicateEmail, AuthController.registerUser);

authRouter.post("/login", AuthController.loginUser);

authRouter.get("/all", AuthController.getAllUsers);

export default authRouter;