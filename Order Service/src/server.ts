import express, { NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import bodyparser from 'body-parser'
import cors from 'cors'
import cartRoutes from './routes/cart.routes'
import orderRoutes from './routes/order.routes'
import { InitiallizeBroker } from './service/broker.service'
dotenv.config()
const app=express()
const PORT=process.env.PORT || 7004


app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended:true}))
app.use(cors())

app.get('/',async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    return res.status(200).json({message: "Server is healthy"})
})



app.use(cartRoutes)
app.use(orderRoutes)

// InitiallizeBroker()

app.listen(PORT,async()=>{
    console.log(`Server Started at port ${PORT}`)

    await InitiallizeBroker()
})