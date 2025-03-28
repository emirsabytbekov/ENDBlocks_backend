import { getKnex } from '../knex.js';

export async function fetchAllUsers() {
    const knex = await getKnex()
    const users = await knex("users")

    return users;
}

export async function fetchUserById(id) {
    const knex = await getKnex()
    const user = await knex("users")
        .where({ id })
        .first()

    return user;
}