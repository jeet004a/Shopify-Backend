import { Response,Request, NextFunction } from "express";
import { createCart, deleteCart, findCart, updateCart } from "../service/cart.service";

export const createCartContoller=async(req:Request,res: Response,next:NextFunction):Promise<any>=>{
    try {
        if(!req.user){
            return res.status(200).json("UnAuthorized")
        }
        const {productId,qty}=req.body
        // console.log(req.user.user_id)
        const data=await createCart(productId,qty,req.user.user_id)
        if(!data){
            return res.status(404).json("product not found")
        }
        return res.status(200).json(data)
        // return res.status(200).json({message: "Healty"})
    } catch (error) {
        console.log(error)
    }

}

export const updateCartContoller=async(req:Request,res: Response,next:NextFunction):Promise<any>=>{
    try {
        if(!req.user){
            return res.status(200).json("UnAuthorized")
        }
        const {productId,qty}=req.body

        const data=await updateCart(productId,qty,req.user.user_id)

        if(!data){
            return res.status(403).json({message: "Something went wrong"})
        }
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}


export const findCartContoller=async(req:Request,res: Response,next:NextFunction):Promise<any>=>{
    try {
        if(!req.user){
            return res.status(200).json("UnAuthorized")
        }
        const response=await findCart(req.user.user_id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}


export const deleteCartContoller=async(req:Request,res: Response,next:NextFunction):Promise<any>=>{
    try {
        if(!req.user){
            return res.status(200).json("UnAuthorized")
        }

        const response=await deleteCart(req.user.user_id)

        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}