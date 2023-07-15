import { knex } from '../database'
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod"

// - Deve ser possível recuperar as métricas de um usuário
//         # Quantidade total de refeições registradas
//         # Quantidade total de refeições dentro da dieta
//         # Quantidade total de refeições fora da dieta
//         # Melhor sequência por dia de refeições dentro da dieta

export const getAllUsers = async (req: FastifyRequest, reply: FastifyReply) => {

    try{
    const user = await knex ("user");

    return reply.status(201).send ({ user })

    } catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        reportError({message})  
}
}

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

        const existingUser = await knex("user").where({ email }).first(); // Valida se existe 
        if (existingUser) {
        reply.status(403).send({ message: "Unable to create an account! User already exists" });
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

export const getUserById = async (req: FastifyRequest, reply: FastifyReply) => {
   
   try{

    const getUserSchema = z.object({
        id: z.string().uuid(),
    })

    const { id } = getUserSchema.parse(req.params);


    const validUser =  await knex ("user").where({id}).first()
    if (!validUser) {
        reply.status(404).send({ message: "User not found"})

    } else {
        const { username, email } = validUser;
        return reply.status(201).send( { username, email })
    }

    }  catch (error) {
        let message = 'Unknown Error'
        if (error instanceof Error) message = error.message
        reportError({message})  
    }   
}



export default { create, getUserById, getAllUsers }


