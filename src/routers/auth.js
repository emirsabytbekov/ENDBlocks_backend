import Router from 'koa-router';
import { handleRegistration, handleLogin } from '../controllers/auth.js';

export const authRouter = new Router; 

authRouter.post("/register", handleRegistration);
authRouter.post("/login", handleLogin);