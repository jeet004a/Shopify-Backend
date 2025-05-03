import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from 'pg'

import * as schema from '../models/product.schema'

require('dotenv').config()

const pool=new Pool({
    connectionString: process.env.DATABASE_URL,
})


export const productDb=drizzle(pool,{schema})