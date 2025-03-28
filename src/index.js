import Koa from "koa"
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';

import { usersRouter } from "./controllers/users.js";

import {getKnex} from "./knex.js"
import { authRouter } from "./controllers/auth.js";

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


async function main() {
    console.log("start", new Date())

    const knex = await getKnex()

    const res = await knex.raw("select 1 + 1 as sum")

    const app = new Koa()
    app.use(bodyparser())
    app.use(router.routes())
    app.use(usersRouter.routes())
    app.use(authRouter.routes())
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