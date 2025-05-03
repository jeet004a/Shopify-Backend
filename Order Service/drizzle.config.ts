require('dotenv').config()


export default {
    schema: ['./src/models/cart.schema.ts','./src/models/order.schema.ts'], // 
    out: './drizzle', // where SQL migration files are stored
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL ,
      },
  };


//How to generate drizzle folder please follow below comment
// npx drizzle-kit generate