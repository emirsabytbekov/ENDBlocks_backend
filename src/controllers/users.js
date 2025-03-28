import { fetchAllUsers, fetchUserById } from '../services/users.js';

export async function getAllUsers(ctx) {
    const users = await fetchAllUsers()
    
    ctx.body = {
        users
    }
    ctx.status = 200
}

export async function getUserById(ctx) {
    const id = ctx.params.id;
    const user = await fetchUserById(id);
    
    ctx.body = {
        user
    }
    ctx.status = 200
}