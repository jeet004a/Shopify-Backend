import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from 'pg'
require('dotenv').config()

import * as schema from '../models/order.schema'

const pool=new Pool({
    connectionString: process.env.DATABASE_URL
})

export const orderDB=drizzle(pool,{schema})
