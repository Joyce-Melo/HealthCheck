import { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('meal', (table => {
        table.uuid('meal_id').primary()
        table.text('meal').notNullable()
        table.text('description')
        table.dateTime('created_at').defaultTo(knex.fn.now()).notNullable()
        table.dateTime('updated_at').defaultTo(knex.fn.now())
        table.boolean('diet_check').defaultTo(true).notNullable()
        table.uuid('user_id')
             .references('user.id')
             .notNullable()
             .onDelete('CASCADE')

    }))
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('meal')
}

