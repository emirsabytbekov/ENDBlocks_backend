import { getKnex } from '../knex.js';

export async function getAllUsers() {
    const knex = await getKnex()
    const users = await knex("users")

    return users;
}

export async function getUserById(id) {
    const knex = await getKnex()
    const user = await knex("users")
        .where({ id })
        .first()

    return user;
}