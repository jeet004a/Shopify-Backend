import express ,{NextFunction, Request,Response, urlencoded} from 'express'
import {PORT} from './config/config'
import userRouter from './routes/user.routes'
// import { DB_Connection } from './DB/index'
// import dbConnection from './db'
import { connectQueue } from './utils'

// const {PORT}=require('./config/config')

// const PORT=8000
const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/user',userRouter)

// DB_Connection()
// dbConnection()
// connectQueue()

app.get('/',async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    return res.status(200).json({message: "Server is healthy"})
})
app.listen(PORT,()=>{
    console.log('Server started at ',PORT)
})

export default app