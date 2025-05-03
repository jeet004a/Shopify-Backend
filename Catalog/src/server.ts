import express,{NextFunction, Request,Response} from 'express'
import bodyParser from 'body-parser'
import catalogRoutes from './routes/catalog.routes'
import dealerRoutes from './routes/dealer.router'
const app=express()
import cors from 'cors'
import { InitiallizeBroker } from './service/broker.service'

app.use(cors())

// app.get('/',async(req:Request,res:Response,next: NextFunction):Promise<any>=>{
//    try {
//     return res.status(200).json({message:'server is healthy'})
//    } catch (error) {
    
//    }
// })

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
app.use(catalogRoutes)
app.use(dealerRoutes)

app.get('/',async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    return res.status(200).json({message: "Server is healthy"})
})

InitiallizeBroker()

app.listen(7002,()=>{
    console.log(`Server started at 7002`)
})