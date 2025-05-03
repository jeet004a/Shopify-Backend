import express from 'express'
import { dealerSignUp,dealerSignin } from '../controllers/dealer.controller'
import {body} from 'express-validator'

const router=express.Router()


router.post('/signup',[
    body("username").isLength({min: 3}).withMessage('Username must be three character long'),
    body('email').isEmail().isLength({min:3}).withMessage('email must be three character long')
],dealerSignUp)
router.get('/signin',dealerSignin)

export default router