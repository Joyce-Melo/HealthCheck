import { knex } from '../database'

const createService = knex('sqlite_schema')
        .select('*')

export default { createService }