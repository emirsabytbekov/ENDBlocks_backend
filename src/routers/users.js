import Router from 'koa-router';
import { getAllUsers, getUserById } from '../controllers/users.js';

export const usersRouter = new Router; 

usersRouter.get("/users", getAllUsers);
usersRouter.get("/user/:id", getUserById);