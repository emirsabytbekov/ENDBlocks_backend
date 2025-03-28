import Koa from "koa"
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import bcrypt from "bcrypt";
import Joi from 'joi';

import { usersRouter } from "./controllers/users.js";

import {getKnex} from "./knex.js"

const router = new Router()

router.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = { hello: "user" };
});


router.get("/scores", async (ctx) => {
    ctx.response.body = {success: true}

    const knex = await getKnex()
    const scores = await knex("highest_scores")

    ctx.body = {
        scores
    }

    ctx.status = 200
})

router.get("/users/:user_id/:high-score", async (ctx) => {
    const knex = await getKnex()
    const h_score = await knex("highest_scores")
        .where({user_id: ctx.params.user_id })
        .first()

    ctx.body = {
        h_score
    }
    ctx.status = 200
})

router.post("/register", async (ctx) => {
    const knex = await getKnex()
    console.log("post request to /users", ctx.request.body)

    const { username, password } = await registerSchema.validateAsync(ctx.request.body);

    const passwordHash = await bcrypt.hash(password, 1)

    const result = await knex('users')
        .insert({
            username,
            password_hash: passwordHash
        })
        .returning("*")
    
    ctx.body = {
        success: true,
        result: result[0]
    }
    ctx.status = 201
})

router.post("/high-score", async (ctx) => {
    const knex = await getKnex()

    const { user_id, new_score } = ctx.request.body

    await knex("highest_scores")
        .where ({user_id : user_id})
        .update ({score: new_score});
    
    const new_h_score = ctx.request.body
    console.log("post request to /highest_scores", new_h_score)

    ctx.body = {
        success: true
    }
    ctx.status = 201
})

router.post("/login", async (ctx) => {
    const knex = await getKnex()
    const {username, password} = ctx.request.body
    console.log("post request to /login", username, password)

    const user = await knex("users")
        .where({username})
        .first()

    if(!user) {
        ctx.status = 401
        ctx.body = {error: "Error finding user with that username"}
        return;
    }

    const passwordMatch = password === user.password

    if(passwordMatch) {
        ctx.status = 200
        ctx.body = {message: "Login successful", user}
    } else {
        ctx.status = 401
        ctx.body = {error: "Invalid password"}
    }
})


const registerSchema = Joi.object({
    username: Joi.string().pattern(/^[A-Za-z]/).min(3).required(),
    password: Joi.string().min(4).max(10).required()
})


async function main() {
    console.log("start", new Date())

    const knex = await getKnex()

    const res = await knex.raw("select 1 + 1 as sum")

    const app = new Koa()
    app.use(bodyparser())
    app.use(router.routes())
    app.use(usersRouter.routes())
    app.use(async (ctx) => {
        ctx.body = {
            hello: "world"
        }

        ctx.status = 200
    })

    console.log(res.rows)

    const HTTP_PORT = 8080

    app.listen(HTTP_PORT, () => {
        console.log("server started at ", HTTP_PORT)
    })
}

main().catch((e) => {
    console.log(e)
    process.exit(1)
})