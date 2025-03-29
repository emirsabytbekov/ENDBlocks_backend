import Router from 'koa-router';
import { handleRegistration, handleLogin, handleLogout } from '../controllers/auth.js';

export const authRouter = new Router; 

authRouter.post("/register", handleRegistration);
authRouter.post("/login", handleLogin);
authRouter.post("/logout", handleLogout);
