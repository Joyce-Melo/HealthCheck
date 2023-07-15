import { FastifyInstance } from "fastify";
import { knex } from '../database'
import mealController from "../controllers/mealController";

// - Deve ser possível recuperar as métricas de um usuário
//         # Quantidade total de refeições registradas -/user/meals/metrics/id
//         # Quantidade total de refeições dentro da dieta /user/meals/true/metrics/id
//         # Quantidade total de refeições fora da dieta /user/meals/false/metrics/id
//         # Melhor sequência por dia de refeições dentro da dieta /user/meals/strike/metrics/id

export async function mealRoutes(app: FastifyInstance){
    
    app.post('/meal', mealController.createMeal)

    app.get('/meals/:user_id', mealController.getMealByUserId)

    app.get('/meal/:meal_id', mealController.getMealByMealId)

    app.patch('/meal/:meal_id', mealController.updateMeal)

    app.delete('/meal/:meal_id', mealController.deleteMeal)

    app.get('/meal/metrics/:user_id', mealController.getAllMealsOfUser)

    app.get('/meal/metrics/true/:user_id', mealController.getTrueDietCheck)

    app.get('/meal/metrics/false/:user_id', mealController.getFalseDietCheck)

    app.get('/meal/metrics/strike/:user_id', mealController.bestTrueStrike)
}

