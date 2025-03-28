import Router from 'koa-router';
import { getAllScores, getScoreById, updateScore } from '../controllers/scores.js';

export const scoresRouter = new Router; 

scoresRouter.get("/scores", getAllScores);
scoresRouter.get("/highscore/:user_id", getScoreById);
scoresRouter.post("/highscore", updateScore)