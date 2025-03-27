import Koa from "koa"
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';
import bcrypt from "bcrypt";

import {getKnex} from "./knex.js"

const router = new Router()

router.get('/', async (ctx) => {
    ctx.status = 200;
    ctx.body = { hello: "user" };
});

router.get("/users", async (ctx) => {
    ctx.response.body = {ok: true}

    const knex = await getKnex()
    const users = await knex("users")

    ctx.body = {
        users
    }

    ctx.status = 200
})

router.get("/user/:id", async (ctx) => {
    const knex = await getKnex()
    const user = await knex("users")
        .where({id: ctx.params.id })
        .first()

    ctx.body = {
        user
    }
    ctx.status = 200
})

router.get("/users/:user_id/:h_score", async (ctx) => {
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

    const { username, password } = ctx.request.body

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

router.post("/h_score", async (ctx) => {
    const knex = await getKnex()
    const new_h_score = ctx.request.body
    console.log("post request to /record", new_h_score)

    const result = await knex("records").insert(new_h_score).returning("*")

    ctx.body = {
        success: true,
        
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


router.get("/users", async (ctx) => {
    const knex = await getKnex()
    const res = await knex("users").select()

    ctx.body = {
        success: true,
        posts: res
    }
    ctx.status = 201
})


async function main() {
    console.log("start", new Date())

    const knex = await getKnex()

    const res = await knex.raw("select 1 + 1 as sum")

    const app = new Koa()
    app.use(bodyparser())
    app.use(router.routes())
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