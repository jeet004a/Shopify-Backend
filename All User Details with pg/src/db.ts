// import { Pool } from "pg";
// require("dotenv").config();

// const pool = new Pool({
//   // connectionString: process.env.DB_URL,
//   connectionString: process.env.DATABASE_URL,
// });

// pool.on("connect", () => {
//   console.log("connected to the db");
// });

// // module.exports = {
// //   query: (text: any, params: any) => pool.query(text, params),
// // };
// const db={query: (text: any, params: any) => pool.query(text, params)}

// export default db;




// ----------------------------------- drizzel-----------------------------------

import {drizzle} from 'drizzle-orm/node-postgres'
import {Pool} from 'pg'
import * as schema from './DB/pgUserSchema'
require("dotenv").config();

const pool =new Pool({
  connectionString: process.env.DIRECT_URL,
})


export const userDB=drizzle(pool,{schema})




