import { knex } from "../database";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

// - Deve ser possível recuperar as métricas de um usuário
//         # Quantidade total de refeições registradas -/meals/metrics/id -Ok
//         # Quantidade total de refeições dentro da dieta /meals/true/metrics/id -Ok
//         # Quantidade total de refeições fora da dieta /meals/false/metrics/id - Ok
//         # Melhor sequência por dia de refeições dentro da dieta /meals/strike/metrics/id

const createMeal = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    //user_id, meal, description, diet_check
    const createMealSchema = z.object({
      user_id: z.string().uuid(),
      meal: z.string(),
      description: z.string(),
      diet_check: z.boolean().nullish().default(true),
    });

    const { user_id, meal, description, diet_check } = createMealSchema.parse(
      req.body
    );

    if (!user_id || !meal) {
      reply
        .status(400)
        .send({ message: "User_id and Meal are mandatory for resgistration" });
    }

    await knex("meal").insert({
      user_id,
      meal,
      description,
      diet_check,
    });

    return reply.status(201).send({ user_id, meal, description, diet_check });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return { message };
  }
};

const getMealByUserId = async (req: FastifyRequest, reply: FastifyReply) => {
  //meal pelo id do usuário

  try {
    const getUserIdSchema = z.object({
      user_id: z.string().uuid(),
    });

    const { user_id } = getUserIdSchema.parse(req.params);

    const query = knex("meal");

    if (user_id) {
      query
        .where({ user_id })
        .join("user", "user.id", "=", "meal.user_id")
        .select("meal.*", "user.username");
    }

    const results = await query;

    return reply.status(200).send({ results });
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return { message };
  }
};

const getMealByMealId = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const getUMealIdSchema = z.object({
      meal_id: z.string().uuid(),
    });

    const { meal_id } = getUMealIdSchema.parse(req.params);

    const validMeal = await knex("meal").where({ meal_id }).first();
    if (!validMeal) {
      reply.status(404).send({ message: "Meal not found" });
    } else {
      const { meal_id, meal, description, diet_check } = validMeal;
      return reply.status(201).send({ meal_id, meal, description, diet_check });
    }
  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return { message };
  }
};

const updateMeal = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const getMealIdSchema = z.object({
        meal_id: z.string().uuid(),
      });

      const createMealSchema = z.object({
        meal: z.string().nullish(),
        description: z.string().nullish(),
        diet_check: z.boolean().nullish().default(true),
      });
  
      const { meal_id } = getMealIdSchema.parse(req.params)

      const {meal, description, diet_check } = createMealSchema.parse(
        req.body
      );

      const validMeal = await knex("meal").where({ meal_id }).first();
    if (!validMeal) {
      reply.status(404).send({ message: "Meal not found" });
    } else{
        if (!meal && !description) {
        reply
          .status(400)
          .send({ message: "Insert at least one field to update" });
      }
  
      await knex("meal").update({
        meal,
        description,
        diet_check,
      });
  
      return reply.status(201).send({validMeal});
    } 

}catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return { message };
  }


}

const deleteMeal = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const getUMealIdSchema = z.object({
      meal_id: z.string().uuid(),
    });

    const { meal_id } = getUMealIdSchema.parse(req.params);

    await knex('meal')
    .where({meal_id})
    .del()

    return reply.status(200).send({message: "Meal succesfully deleted"})


  } catch (error) {
    let message = "Unknown Error";
    if (error instanceof Error) message = error.message;
    return { message };
  }
};

const getAllMealsOfUser = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const getUserIdSchema = z.object({
          user_id: z.string().uuid(),
        });
    
        const { user_id } = getUserIdSchema.parse(req.params);
    
        const query = knex("meal").count("* as count").where({ user_id });
    
        const [{ count }] = await query;

        return reply.status(200).send({ count });

      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        return { message };
      }

}

const getTrueDietCheck = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const getUserIdSchema = z.object({
          user_id: z.string().uuid(),
        });
    
        const { user_id } = getUserIdSchema.parse(req.params);
    
        let query = knex("meal").count("* as count").where({ user_id });

        if("meal.diet_check"){
            query = query.where("meal.diet_check", true);
        }
    
        const [{ count }] = await query;

        return reply.status(200).send({ count });

      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        return { message };
      }

}

const getFalseDietCheck = async (req: FastifyRequest, reply: FastifyReply) => {

    try {
        const getUserIdSchema = z.object({
          user_id: z.string().uuid(),
        });
    
        const { user_id } = getUserIdSchema.parse(req.params);
    
        let query = knex("meal").count("* as count").where({ user_id });
        
        if("meal.diet_check"){
            query = query.where("meal.diet_check", false);
        }
    
        const [{ count }] = await query;

        return reply.status(200).send({ count });

      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        return { message };
      }

}

const bestTrueStrike = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
        const getUserIdSchema = z.object({
          user_id: z.string().uuid(),
        });
    
        const { user_id } = getUserIdSchema.parse(req.params);
    
        const query = knex("meal")
        .select(knex.raw("strftime('%d-%m-%Y', meal.created_at) as day, group_concat(meal.meal_id) as sequence"))
          .where({ user_id, diet_check: true })
          .groupByRaw("day")
          .orderByRaw("count(*) desc")
          .limit(1);
    
        const result = await query;
    
        if (result.length === 0) {
          return reply.status(404).send({ message: "No best sequence found" });
        }
    
        const { day, sequence } = result[0];
    
        return reply.status(200).send({ day, sequence });
      } catch (error) {
        let message = "Unknown Error";
        if (error instanceof Error) message = error.message;
        return { message };
      }

    //   strftime('%Y-%m-%d', meal.created_at) as day is used to extract the day from the created_at column. The group_concat function is used instead of array_agg to concatenate the meal.id values into a string for each day.
}


export default { createMeal, getMealByUserId, getMealByMealId, deleteMeal, updateMeal, getAllMealsOfUser, getTrueDietCheck, getFalseDietCheck, bestTrueStrike}
