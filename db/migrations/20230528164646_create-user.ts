import { Knex } from "knex";

//id, username, email, password, created_at, updated_at

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', (table => {
        table.uuid('id').primary()
        table.text('username').notNullable()
        table.text('email').notNullable()
        table.text('password').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    }))
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user')
}

