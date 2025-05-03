import { NextFunction, Request, Response } from "express";
import { dealerSiginService, dealerSignup } from "../service/dealer.service";

export const dealerSignUp=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const response=await dealerSignup(req.body)
        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const dealerSignin=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const response=await dealerSiginService(req.body)
        
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}