import express, { Router } from 'express'
import { createOrderContoller,getAllOrderRecordsController,getOrderByIdController,editOrderByidController,deleteOrderByIdController} from '../contollers/order.contoller'
import { RequestValidator } from '../middlewares/user.auth'
const router=express.Router()


router.post('/order',RequestValidator,createOrderContoller)

router.get('/orders',RequestValidator,getAllOrderRecordsController)

router.get('/order/:id',RequestValidator,getOrderByIdController)

router.patch('/order/:id',RequestValidator,editOrderByidController)

router.delete('/order/:id',RequestValidator,deleteOrderByIdController)


export default router