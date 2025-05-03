import { productDetails } from "../utils/api.calls"
import { carts,cartLineItems } from "../models/cart.schema"
import { eq,and } from "drizzle-orm"
import {cartDb} from '../db/cart.connection'
export const createCart=async(productId:number,qty:number,customerId:number)=>{
    try {
        const response=await productDetails(productId)
        
        if(response.length<1){
            return false
        }
        const productRec=response[0]
        const result=await cartDb.insert(carts).values({customerId: customerId}).returning().onConflictDoUpdate({
            target: carts.customerId,
            set:{
                updatedAt: new Date()
            }
        })

        const [{id}] =result
        // console.log(productRec)
        if(qty>productRec.stock){
            return `${productRec.name} available stock only and only ${productRec.stock} and you pass ${qty}`
        }

        const existingRec=await cartDb.select().from(cartLineItems).where(and(eq(cartLineItems.productId,productId),eq(cartLineItems.cartId,id)))


        // console.log(existingRec)
        if(existingRec.length!=0){
            await cartDb.update(cartLineItems).set({qty: qty}).where(eq(cartLineItems.productId,productId))
            return "Updated the qty"
        }

        if(id>0){
            await cartDb.insert(cartLineItems).values({
                productId: productId,
                cartId: id,
                itemName: productRec.name,
                price: productRec.price,
                qty: qty,
                category: productRec.category
            })
        }


        return id
    } catch (error) {
        console.log(error)
    }

}



export const updateCart=async(productId:number,qty:number,customerId:number)=>{
    try {
        const response=await productDetails(productId)
        const productRec=response[0]

        if(qty>productRec.stock){
            return `${productRec.name} available stock only and only ${productRec.stock} and you pass ${qty}`
        }


        const existingRec=await cartDb.select().from(cartLineItems).where(eq(cartLineItems.productId,productId))


        // console.log(existingRec)
        if(existingRec){
            await cartDb.update(cartLineItems).set({qty: qty}).where(eq(cartLineItems.productId,productId))
            return "Updated the qty"
        }

        return false
    } catch (error) {
        console.log(error)
    }
}


export const findCart=async(customerId:number)=>{
    try {
        const  cart=await cartDb.select().from(carts).leftJoin(cartLineItems,eq(carts.id,cartLineItems.cartId)).where(eq(carts.customerId,customerId))
        
        if(!cart){
            return "Cart Not found"
        }
        
        return cart
    } catch (error) {
        console.log(error)
    }
}


export const deleteCart=async(customerId:number)=>{
    try {
        const Usercart=await cartDb.select().from(carts).where(eq(carts.customerId,customerId))

        if(Usercart.length==0){
            return "Cart not found"
        }
        const data =await cartDb.delete(cartLineItems).where(eq(cartLineItems.cartId,Usercart[0].id))

        if(data){
            return "Cart Deleted"
        }
        
        return "Something went wrong"
    } catch (error) {
        console.log(error)
    }
}


export const clearUserCart=async(customerId:number)=>{
    const Usercart=await cartDb.select().from(carts).where(eq(carts.customerId,customerId))

    if(Usercart.length==0){
        return "Cart not found"
    }
    const data =await cartDb.delete(cartLineItems).where(eq(cartLineItems.cartId,Usercart[0].id))

    if(data){
        return "Cart Deleted"
    }
    
    return "Something went wrong"
}