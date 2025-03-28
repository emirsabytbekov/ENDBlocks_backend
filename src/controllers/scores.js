import Router from 'koa-router';
import { getAllScores, getScoreById, setNewScore } from '../services/scores.js';

export const scoresRouter = new Router;

scoresRouter.get("/scores", async (ctx) => {
    ctx.response.body = {success: true}

    const scores = await getAllScores();
    ctx.body = {
        scores
    }

    ctx.status = 200
})

scoresRouter.get("/users/:user_id", async (ctx) => {
    const user_id = ctx.params.user_id;
    const highscore = await getScoreById(user_id);

    ctx.body = {
        highscore
    }
    ctx.status = 200
})

scoresRouter.post("/high-score", async (ctx) => {
    const { user_id, new_score } = ctx.request.body

    await setNewScore(user_id, new_score);

    ctx.body = {
        success: true
    }
    ctx.status = 201
})