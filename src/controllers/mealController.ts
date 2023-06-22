import { knex } from '../database'
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"

export const createMeal = async (req: FastifyRequest, reply:FastifyReply) => {

    try{

        // const getUserSchema = z.object({
        //     id: z.string().uuid(),
        // })

        const createMealSchema = z.object({
            meal: z.string(),
            description: z.string(),
            diet_check: z.boolean()
        })

        // const { id } = getUserSchema.parse(req.params);

        const { meal, description, diet_check } = createMealSchema.parse (req.body)

        // const validUser =  await knex ("user").where({id}).first()

        // if (  validUser  ) {
        await knex ("meal").insert({
            meal,
            description,
            diet_check
        })
        return reply.status(201).send({ meal, description, diet_check })

    // } 

    } catch (error) {
         let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        reportError({message})  
    }

}

export default { createMeal }