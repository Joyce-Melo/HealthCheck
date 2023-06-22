import { FastifyInstance } from "fastify";
import { knex } from '../database'
import mealController from "../controllers/mealController";

export async function mealRoutes(app: FastifyInstance){
    
    app.post('/meal', mealController.createMeal)
}