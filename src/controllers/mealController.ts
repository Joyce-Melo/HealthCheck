import { knex } from '../database'
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"

const createMeal = async (req: FastifyRequest, reply:FastifyReply) => {

    try{

        //user_id, meal, description, diet_check
        const createMealSchema = z.object({
            user_id: z.string().uuid(),
            meal: z.string(),
            description: z.string(),
            diet_check: z.boolean().nullish().default(true)
        })

        const {user_id, meal, description, diet_check} = createMealSchema.parse(req.body)

        if (!user_id || !meal) {
            reply.status(400).send({message: "User_id and Meal are mandatory for resgistration"})
        }


        await knex ("meal").insert({
            user_id,
            meal,
            description,
            diet_check
        })

        return reply.status(201).send({ user_id, meal, description, diet_check })

    } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        return({message})
    }


    
}

const getMealById = async (req: FastifyRequest, reply: FastifyReply) => {

    try{

    const getUserIdSchema = z.object({
        user_id: z.string().uuid()
    })

    const query = knex ('meal')

    const {user_id} = getUserIdSchema.parse(req.params)

    if (user_id) {
        query
        .where({user_id})
        .join('users', 'users.id', '=', 'meal.user_id')
        .select('meal.*', 'user.username')
    }

        const results = await query
        return reply.status(200).send({results})
    
    }catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        return({message})
    }
}

export default { createMeal, getMealById }