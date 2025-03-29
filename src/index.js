import Koa from "koa"
import Router from 'koa-router';
import bodyparser from 'koa-bodyparser';

import { getKnex } from "./knex.js"

import { usersRouter } from "./routers/users.js";
import { scoresRouter } from "./routers/scores.js";
import { authRouter } from "./routers/auth.js";

const router = new Router()

async function main() {
    console.log("start", new Date())

    const knex = await getKnex()

    const res = await knex.raw("select 1 + 1 as sum")

    const app = new Koa()

    app.use(async (ctx, next) => {
        try {
            await next();
        } catch (e) {
            if (e.isJoi) {
               ctx.status = 400;
                ctx.body = {
                    message: e.message,
                };
                return;
            }
            console.log(e);

            ctx.status = 500;
            ctx.body = {
                message: e.message,
            };
        }
    });

    app.use(bodyparser())

    app.use(async (ctx, next) => {
        console.log(ctx.method, ctx.url, ctx.body);
        await next();
    });

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