import Koa from "koa"
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';

import { usersRouter } from "./controllers/users.js";

import {getKnex} from "./knex.js"
import { authRouter } from "./controllers/auth.js";
import {scoresRouter} from "./controllers/scores.js";

const router = new Router()

async function main() {
    console.log("start", new Date())

    const knex = await getKnex()

    const res = await knex.raw("select 1 + 1 as sum")

    const app = new Koa()
    app.use(bodyparser())
    app.use(router.routes())
    app.use(usersRouter.routes())
    app.use(authRouter.routes())
    app.use(scoresRouter.routes())
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