import express from 'express'
import { createCartContoller, findCartContoller, updateCartContoller,deleteCartContoller } from '../contollers/cart.controller'
import { RequestValidator } from '../middlewares/user.auth'

const router=express.Router()

router.post('/cart',RequestValidator,createCartContoller)

router.put('/cart',RequestValidator,updateCartContoller)

router.get('/cart',RequestValidator,findCartContoller)

router.delete('/cart',RequestValidator,deleteCartContoller)

export default router