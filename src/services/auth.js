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