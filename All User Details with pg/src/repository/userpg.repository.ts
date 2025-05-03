import {NextFunction, Request,Response} from 'express'
// import { SignInService, SignUpService, UserProfileService } from '../services/userpg.service'
import {  SignUpService,SignInService,UserProfileService,userById } from '../services/userpg.service'
import { validationResult } from 'express-validator'
// import { User } from '../DB/user.model'
import {userDB} from '../db'
import {user} from '../DB/pgUserSchema'

import { faker } from '@faker-js/faker';
import { genPassword, genSalt } from '../utils'
import { APP_SECRET } from '../config/config'
import jwt from 'jsonwebtoken'

export const  SignUp=async (req:Request,res:Response,next: NextFunction):Promise<any>=>{
    try {
        // console.log('Hello')
        const result=await SignUpService(req.body)
        

        //Below for create fake user
        // for(let i=0;i<50;i++){
        //     const userDetails={
        //         firstName: faker?.name?.firstName(),
        //         lastName: faker.name.lastName(),
        //         email: faker.internet.email(),
        //         password: faker.internet.password(),
        //         salt:faker.internet.password(),
        //     }
        //     const salt=await genSalt()
        //     const hasedPassword=await genPassword(salt,userDetails.password)
        //     userDetails.password=hasedPassword
        //     userDetails.salt=salt
        //     await userDB.insert(user).values(userDetails)
        // }


        return res.status(201).json(result)
    } catch (error) {   
        throw new Error("Invalid Signup");
        
    }
}

export const  SignIn=async (req:Request,res:Response,next: NextFunction):Promise<any>=>{
    try {
        // let {email,password }=req.body
        const existingUser=await SignInService(req.body)
        return res.status(200).json(existingUser)
    } catch (error) {   
        throw new Error("Invalid Signup");
        
    }
}

export const UserProfile=async(req:Request,res: Response,next: NextFunction):Promise<any>=>{
    try {
        // console.log(req.user)
        // const {_id}=req.user
        // const data=await User.findById(_id)
        const {email}=req.user

        let result=await UserProfileService({email})
        // console.log(req.user)
        return res.status(200).json(result)
    } catch (error) {
        console.log(error)
        throw new Error("Error from User profile repository");
        
    }
}


export const UserDetailsById=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const {email}=req.user
        if(!email){
            return res.status(401).json({"message":"Not authorized"})
        }
        // const {id}=req.params
        const userDetails=await userById(req.params)
        if(!userDetails){
            return res.status(401).json({"message":"User Not Found with this id"})
        }
        // console.log(userDetails)
        return res.status(200).json(userDetails)
    } catch (error) {
        console.log(error)
    }
}


export const validatedUser=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const token = req.headers["authorization"];
        if(!token){
            return res.status(401).json({message: "Unauthorized"})
        }
        const tokenData = token.split(" ")[1];
        const payload = await jwt.verify(tokenData, APP_SECRET)
        // if(!payload){
        //     return res.status(401).json({message: "Unauthorized"})
        // }
        // const userData=await UserProfileService(payload)
        if (typeof payload === "object" && "email" in payload) {
            const user=await UserProfileService({email: payload.email})
            // console.log(user)
            return res.status(200).json(user);
        } else {
            return res.status(401).json({ message: "Invalid token payload" });
        }
    } catch (error) {
        return res.status(403).json({message: "Invalide token"})
    }
}

// module.exports={
//     SignUpService,
//     SignInService
// }