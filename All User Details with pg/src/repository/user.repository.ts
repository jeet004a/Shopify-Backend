import {NextFunction, Request,Response} from 'express'
import { SignInService, SignUpService } from '../services/user.service'
import { validationResult } from 'express-validator'
import { User } from '../DB/user.model'

export const  SignUp=async (req:Request,res:Response,next: NextFunction):Promise<any>=>{
    try {
        const errors=validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() })
        }
        const UserDetails= await SignUpService(req.body)
        return res.status(201).json(UserDetails)
        // res.status(200).json({1:1})
    } catch (error) {   
        throw new Error("Invalid Signup");
        
    }
}

export const  SignIn=async (req:Request,res:Response,next: NextFunction):Promise<any>=>{
    try {
        const userData=await SignInService(req.body)
        return res.status(200).json(userData)
    } catch (error) {   
        throw new Error("Invalid Signup");
        
    }
}

export const UserProfile=async(req:Request,res: Response,next: NextFunction):Promise<any>=>{
    try {
        // console.log(req.user)
        const {_id}=req.user
        const data=await User.findById(_id)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
        throw new Error("Error from User profile repository");
        
    }
}

// module.exports={
//     SignUpService,
//     SignInService
// }