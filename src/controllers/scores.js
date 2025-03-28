import { fetchAllScores, fetchScoreById, setNewScore } from '../services/scores.js';

export async function getAllScores(ctx) {
    const scores = await fetchAllScores();
    ctx.body = {
        scores
    }

    ctx.status = 200
}

export async function getScoreById(ctx) {
    const user_id = ctx.params.user_id;
    const highscore = await fetchScoreById(user_id);

    ctx.body = {
        highscore
    }
    ctx.status = 200
}

export async function updateScore(ctx) {
    const { user_id, new_score } = ctx.request.body

    await setNewScore(user_id, new_score);

    ctx.body = {
        success: true
    }
    ctx.status = 201
}