require("dotenv").config();

export default {
    schema: './src/DB/pgUserSchema.ts', 
    out: './drizzle', // where SQL migration files are stored
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DIRECT_URL ,
      },
  };