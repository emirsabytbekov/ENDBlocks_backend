import {getKnex} from '../knex.js';

export async function fetchAllScores() {
    const knex = await getKnex()
    const scores = await knex("highest_scores")

    return scores;
}

export async function fetchScoreById(user_id) {
    const knex = await getKnex()
    const highscore = await knex("highest_scores")
        .where({user_id })
        .first()
    
    return highscore;
}

export async function setNewScore(user_id, new_score) {
    const knex = await getKnex()

    const newScore = await knex("highest_scores")
        .where ({user_id : user_id})
        .update ({score: new_score});

    return newScore;
}