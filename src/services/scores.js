import {getKnex} from '../knex.js';

export async function getAllScores() {
    const knex = await getKnex()
    const scores = await knex("highest_scores")

    return scores;
}

export async function getScoreById(user_id) {
    const knex = await getKnex()
    const h_score = await knex("highest_scores")
        .where({user_id })
        .first()
    
    return h_score;
}

export async function setNewScore(user_id, new_score) {
    const knex = await getKnex()

    const newScore = await knex("highest_scores")
        .where ({user_id : user_id})
        .update ({score: new_score});

    return newScore;
}