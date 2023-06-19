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

        const existingUser = await knex("user").where({ email }).first();
        if (existingUser) {
        reply.status(403).send({ message: "Unable to create an account because user already exists" });
        return;
        }

        await knex ("user").insert({
            username,
            email,
            password
        });

        return reply.status(201).send( { username, email })

    } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        reportError({message})  
    }   
}

export default { create }


