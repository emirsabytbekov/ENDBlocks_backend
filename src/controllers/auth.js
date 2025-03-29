import bcrypt from "bcrypt";
import Joi from "joi";
import { v4 as uuidv4 } from "uuid";
import Koa from 'koa';
import koaBody from 'koa-bodyparser';
import { register, getUser, saveTokenToDB } from "../services/auth.js";

export async function handleRegistration(ctx) {
    console.log("post request to /users MVC", ctx.request.body);

    const registerSchema = Joi.object({
        username: Joi.string().pattern(/^[A-Za-z]/).min(3).required(),
        password: Joi.string().min(4).max(10).required(),
    });

    const { username, password } = await registerSchema.validateAsync(ctx.request.body);
    const passwordHash = await bcrypt.hash(password, 12);
    const user = await register(username, passwordHash);

    const sessionToken = uuidv4();
    await saveTokenToDB(user.id, sessionToken);

    ctx.cookies.set("sessionToken", sessionToken, {
        httpOnly: true,
        //secure: true, будет работать только с https
        sameSite: "Strict", 
        maxAge: 1000 * 60 * 60 * 24, 
    });

    ctx.body = {
        success: true,
        user,
    };
    ctx.status = 201;
}

export async function handleLogin(ctx) {
    const { username, password } = ctx.request.body;
    console.log("post request to /login MVC", username, password);

    const user = await getUser(username);
    if (!user) {
        ctx.status = 401;
        ctx.body = { error: "Error finding user with that username" };
        return;
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
        ctx.status = 401;
        ctx.body = { error: "Invalid password" };
        return;
    }

    const sessionToken = uuidv4();
    await saveTokenToDB(user.id, sessionToken);

    ctx.cookies.set("sessionToken", sessionToken, {
        httpOnly: true,
        //secure: true, будет работать только с https
        sameSite: "Strict",
        maxAge: 1000 * 60 * 60 * 24, 
    });

    ctx.status = 200;
    ctx.body = { message: "Login successful" };
}
