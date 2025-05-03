import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from 'pg'

import * as schema from '../models/dealer.schema'

require('dotenv').config()

const pool=new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const delaerDb=drizzle(pool,{schema})