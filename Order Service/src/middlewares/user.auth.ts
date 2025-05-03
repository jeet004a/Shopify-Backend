import { NextFunction, Request, Response } from "express";
import { validateUser } from "../utils/api.calls";

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

export const RequestValidator=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        if(!req.headers.authorization){
            return res.status(403).json("UnAuthorized due to authorization token missing !!!")
        }
        const userData=await validateUser(req.headers.authorization as string)

        if(!userData){
            return res.status(401).json("UnAuthorized")
        }
        req.user=userData
        next()
    } catch (error) {
        console.log(error)
    }
}