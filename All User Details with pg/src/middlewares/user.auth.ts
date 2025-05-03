import { validateSignature } from "../utils"
import { NextFunction, Request,Response } from "express"

export const UserAuth=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    const user=await validateSignature(req)
    if(!user){
        return res.status(404).json({"Message":"Not found"})
    }
    next()
}