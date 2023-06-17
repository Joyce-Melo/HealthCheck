import { knex } from '../database'
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"


export const create = async (req: FastifyRequest, reply: FastifyReply) => {

    try{

        const createUserSchema = z.object({
            username: z.string(),
            email: z.string(),
            password: z.string()
        })

        const {username, email, password} = createUserSchema.parse (req.body)

        if (!username || !email || !password) {
            reply.status(400).send({ message: "Submit all fields for registration"})
        }

        await knex ("user").insert({
            username,
            email,
            password
        });

        return reply.status(201).send( { username, email })

    } catch (error: any) {
        reply.status(500).send({ messaage: error.messaage });
    }
    
}

export default { create }


