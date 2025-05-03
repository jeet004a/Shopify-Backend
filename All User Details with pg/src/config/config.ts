import dotenv from 'dotenv'

dotenv.config()

// module.exports={
//     PORT: process.env.PORT
// }

export const PORT= process.env.PORT as string
export const DB_URL =process.env.DB_URL as string
export const APP_SECRET=process.env.APP_SECRET as string
export const TEST_DB_URL=process.env.TEST_DB_URL as string