import { getKnex } from "../knex.js";

export async function register(username, passwordHash) {
    const knex = await getKnex();

    const registerResult = await knex('users')
        .insert({
            username,
            password_hash: passwordHash
        })
        .returning("*")

    const [result] = registerResult
    return result;
}

export async function getUser(username) {
    const knex = await getKnex();

    const result = await knex("users")
        .where('username', username)
        .select('*');
    
    const [user] = result;
    return user;
}

export async function saveTokenToDB(userId, token) {
    const knex = await getKnex(); 

    const existingSession = await knex('tokens')
        .where('user_id', userId)
        .select('id');

    if (existingSession.length > 0) {
        // Если сессия уже есть, обновляем токен
        await knex('tokens')
            .where('user_id', userId)
            .update({
                token: token,
                created_at: knex.fn.now() 
            });
    } else {
        // Если сессии нет, создаем новую
        await knex('tokens')
            .insert({
            user_id: userId,
            token: token,
            created_at: knex.fn.now()
        });
    }
}