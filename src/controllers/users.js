import Router from 'koa-router';
import { getAllUsers, getUserById } from '../services/users.js';

export const usersRouter = new Router; 

usersRouter.get("/users", async (ctx) => {
    ctx.response.body = {ok: true}
    console.log("workinnnn");

    const users = await getAllUsers()
    ctx.body = {
        users
    }

    ctx.status = 200
})

usersRouter.get("/user/:id", async (ctx) => {
    const id = ctx.params.id;
    const user = await getUserById(id);
    ctx.body = {
        user
    }
    ctx.status = 200
})