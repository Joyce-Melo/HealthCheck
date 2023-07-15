import { FastifyInstance } from "fastify";
import { knex } from '../database'
import  userController  from '../controllers/userController'



export async function userRoutes(app: FastifyInstance){

    app.get('/user', userController.getAllUsers)
    
    app.get('/user/:id', userController.getUserById)

    app.post('/user', userController.create)

    
}