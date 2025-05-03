import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from 'pg'

import * as schema from '../models/cart.schema'

require('dotenv').config()

const pool=new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const cartDb=drizzle(pool,{schema})