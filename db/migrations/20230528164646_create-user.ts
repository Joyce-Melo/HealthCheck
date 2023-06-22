import knex, { Knex } from "knex";
import config from "../../knexfile";
import { v4 as uuidv4 } from 'uuid';

//id, username, email, password, created_at, updated_at

let uuidGenerationRaw = config.client === 'sqlite' ? 
  `(lower(hex(randomblob(4))) || '-' || lower(hex(randomblob(2))) || '-4' || substr(lower(hex(randomblob(2))),2) || '-' || substr('89ab',abs(random()) % 4 + 1, 1) || substr(lower(hex(randomblob(2))),2) || '-' || lower(hex(randomblob(6))))` :
  `uuid_generate_v4()`;

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('user', (table => {
        table.uuid('id').primary().defaultTo(knex.raw(uuidGenerationRaw))
        table.text('username').notNullable()
        table.text('email').unique().notNullable()
        table.text('password').notNullable()
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
        table.timestamp('updated_at').defaultTo(knex.fn.now())
    }))
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('user')
    
}

