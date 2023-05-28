import { FastifyInstance } from "fastify";
import { knex } from '../database'

export async function userRoutes(app: FastifyInstance){
    app.get('/hello', async () => {
        const user = await knex('user')
        .select('*')

        return user
    })
}