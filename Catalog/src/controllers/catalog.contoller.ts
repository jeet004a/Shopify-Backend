import {Request,Response,NextFunction} from 'express'
import { CreateProduct, deleteProductById, getProductsByDealer, updateProductById,getAll,ProductGetById } from '../service/catalog.service'
import {validationResult} from 'express-validator'
import { delaerDb } from '../db/dealer.connection'
import { dealer } from '../models/dealer.schema'
import { eq } from "drizzle-orm"

export const createProduct=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const errors=validationResult(req)
        // console.log()
        if(!errors.isEmpty()){
            return res.status(401).json({ errors: errors.array()})
        }

        // console.log(req.dealer)
        const {email}=req.dealer
        const delaerId=await delaerDb.select({id:dealer.id}).from(dealer).where(eq(dealer.email,email))
        // console.log(delaerId[0].id)
        // const id=delaerId[0].id
        if(!delaerId){
            return res.status(404).json({message: "Not authorized to create product"})
        }
        const productServiceResponse=await CreateProduct(req.body,delaerId[0].id)
        if(!productServiceResponse){
            return res.status(400).json({message:"Somthing went wrong try after some time sorry for inconvienecev :)"})
        }
        let response={
            status: true,
            message: "Product created",
            data: productServiceResponse
        }
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const updateProduct=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const {id}=req.params
        const {stock}=req.body
        const {email}=req.dealer
        const delaerId=await delaerDb.select({id:dealer.id}).from(dealer).where(eq(dealer.email,email))
        const DBResponse=await updateProductById(+id,stock,delaerId[0].id)
        if(!DBResponse){
            return res.status(404).json({message: "Somthing went wrong"})
        }

        return res.status(200).json("Updated successfully")
    } catch (error) {
        console.log(error)
    }
}

export const getProducts=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const {email}=req.dealer
        const delaerId=await delaerDb.select({id:dealer.id}).from(dealer).where(eq(dealer.email,email))
        const response=await getProductsByDealer(delaerId[0].id)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const deleteProduct=async(req:Request,res:Response,next: NextFunction):Promise<any>=>{
    try {
        const {email}=req.dealer
        const delaerId=await delaerDb.select({id:dealer.id}).from(dealer).where(eq(dealer.email,email))
        const response=await deleteProductById(+req.params.id,delaerId[0].id)

        if(!response){
            return res.status(404).json({message: "Unable to delete product"})
        }

        return res.status(200).json({
            message: "Deleted successfully"
        })
    } catch (error) {
        console.log(error)
    }
}

export const getAllProducts=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const response=await getAll()
        return res.status(200).json(response)
    } catch (error) {
        
    }
}

export const getProductById=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        const productId=req.params.id
        const response=await ProductGetById(+productId)
        if(!response){
            return res.status(404).json("Not Found")
        }
        return res.status(200).json(response)
    } catch (error) {
        
    }
}