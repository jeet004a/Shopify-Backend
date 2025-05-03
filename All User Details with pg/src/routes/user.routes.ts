import express,{Request,Response, NextFunction} from 'express'
import {body} from 'express-validator'
// import UserRepository from '../repository/user.repository'
// import UserRepository from '../repository/user.repository'
// import {SignUp,SignIn,UserProfile} from '../repository/userpg.repository'
import {SignUp,SignIn,UserProfile, UserDetailsById,validatedUser} from '../repository/userpg.repository'
import { UserAuth } from '../middlewares/user.auth'
import { sendData } from '../utils'
import { UserProfileService } from '../services/userpg.service'
import { rateLimiter } from '../services/rate-limiter'
// import { SignUpService } from '../services/userpg.service'

const router=express.Router()


router.post('/signup',body('email').isEmail().withMessage('Invalid Email id')
,body('password').isLength({min: 3}).withMessage('Password must be 3 character long')
,body('first_name').isString().isLength({min:3}).withMessage('First Name sould be more than 3 character')
,body('last_name').isString().isLength({min:3}).withMessage('First Name sould be more than 3 character')
,SignUp)

router.get('/signin',SignIn)

router.get('/profile',UserAuth,UserProfile)  //rateLimiter

router.get('/validate',validatedUser)

router.get('/:id',UserAuth,UserDetailsById)





router.get('/send-message',(req:Request,res: Response)=>{
    const data = {
        title  : "Six of Crows",
        author : "Leigh Burdugo"
    }
    sendData(data)
    res.send("Message Sent")
})

router.get('/health',(req:Request,res: Response)=>{
    res.send("Server is up and running")
})

export default router