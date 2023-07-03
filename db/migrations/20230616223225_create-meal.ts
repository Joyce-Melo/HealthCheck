import { Knex } from "knex";
import config from "../../knexfile";


let uuidGenerationRaw = config.client === 'sqlite' ? 
  `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))` :
  `uuid_generate_v4()`;


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meal', (table => {
        table.uuid('meal_id').primary().defaultTo(knex.raw(uuidGenerationRaw))
        table.text('meal').notNullable()
        table.text('description')
        table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable()
        table.dateTime('updated_at').defaultTo(knex.fn.now())
        table.boolean('diet_check').defaultTo(true)
        table.uuid('user_id')
             .references('user.id')
             .notNullable()
             .onDelete('CASCADE')

    }))
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meal')
}

