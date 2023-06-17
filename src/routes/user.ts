import { FastifyInstance } from "fastify";
import { knex } from '../database'
import  userController  from '../controllers/userController'

export async function userRoutes(app: FastifyInstance){
    
    app.get('/users', async () => {
        const user = await knex('sqlite_schema')
        .select('*')

        return user

    })

    app.post('/user', userController.create)
}