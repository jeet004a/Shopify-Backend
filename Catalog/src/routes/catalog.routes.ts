import express, { NextFunction, Request, Response } from 'express'
import { body } from 'express-validator'
import { createProduct, getProducts, updateProduct,deleteProduct,getAllProducts,getProductById } from '../controllers/catalog.contoller'
import { DealerAuth } from '../middleware/dealer.auth'

const router =express.Router()


router.post('/product',[body('name').isLength({min: 3}).withMessage('Product name should be 3 character long'),
    body('description').isLength({min:3}).withMessage('Priduct description should be 3 character long')
],DealerAuth,createProduct)

router.patch('/product/:id',DealerAuth,updateProduct)

router.delete('/product/:id',DealerAuth,deleteProduct)

router.get('/products',DealerAuth,getProducts)

router.get('/allproducts',getAllProducts)

router.get('/product/:id',getProductById)

export default router