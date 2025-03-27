import Knex from 'knex';

let knex;

export async function getKnex() {
    if (knex) {
        return knex;
    }

    const PG_URI = 'postgres://postgres:SER23052007@localhost/postgres';
    knex = Knex(PG_URI);

    return knex;
}