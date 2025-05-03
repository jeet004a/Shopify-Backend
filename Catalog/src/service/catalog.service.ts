import { eq,and } from "drizzle-orm"
import { productDb } from "../db/db.connection"
import { product} from "../models/product.schema"
import { dealer } from "../models/dealer.schema"
import {faker} from '@faker-js/faker'

export const CreateProduct=async(payload : any,dealerId:number)=>{
    try {
        const {name,description,category, price,imageURL,stock}=payload
        // console.log(req.dealer)
        const data=await productDb.insert(product).values({
            name:name,
            description:description,
            category: category,
            price: price,
            imageUrl:imageURL,
            dealerId: dealerId,
            stock: stock
        }).returning()
        console.log(data)

        if(data.length>0){
            return data[0]
        }

        return false

        //Below is for create demo data
        // for(let i=0;i<20;i++){
        //     await productDb.insert(product).values({
        //         name: faker.commerce.productName(),
        //         description:faker.commerce.productDescription().slice(0,255),
        //         category: faker.commerce.department(),
        //         price: faker.number.int({ min: 10, max: 1000 }),
        //         imageUrl:imageURL,
        //         stock: faker.number.int({ min: 0, max: 500 }),
        //         dealerId: dealerId
        //     })
        // }
        // console.log('abc',name)
        // return 1
    } catch (error) {
        console.log(error)
    }
}


export const updateProductById=async(id: number,stock: number,dealerId:number)=>{
    try {
        const updateProductData=await productDb.update(product).set({stock: stock}).where(and(eq(product.id,id),eq(product.dealerId,dealerId))).returning()

        if(!updateProductData){
            return false
        }
        return updateProductData
    } catch (error) {
        console.log(error)   
    }
}

//Only call broker
export const updateProductByIdBroker=async(id: number,stock: number)=>{
    try {
        const updateProductData=await productDb.update(product).set({stock: stock}).where(eq(product.id,id)).returning()

        if(!updateProductData){
            return false
        }
        return updateProductData
    } catch (error) {
        console.log(error)   
    }
}

export const getProductsByDealer=async(dealerId:number)=>{
    try {
        // console.log(dealerId)
        const productData=await productDb.select().from(product).where(eq(product.dealerId,dealerId))
        // console.log(productData)
        if(!productData){
            return "No product available"
        }

        return productData
    } catch (error) {
        console.log(error)
    }
}

export const deleteProductById=async(productId:number,delaerId:number)=>{
    try {
        const response=await productDb.delete(product).where(and (eq(product.id,productId),eq(product.dealerId,delaerId)))
        console.log(response)
        if(response.rowCount==0){
            return false
        }

        return true
    } catch (error) {
        console.log(error)
    }

}


export const getAll=async()=>{
    try {
        const data=await productDb.select().from(product)
        return data
    } catch (error) {
        console.log(error)
    }
}


export const ProductGetById=async(productId:number)=>{
    try {
        const response=await productDb.select().from(product).where(eq(product.id,productId))

        return response
    } catch (error) {
        console.log(error)
    }
}


export async function handleBrokerMessage(message:any) {
    const orderData=message.data as any
    // if(!orderData){
        
    // }
    const {items }=orderData
    items.forEach(async(item : any)=>{
        const product: any=await ProductGetById(item.productId)
        // console.log(product[0].stock)
        // console.log(item.qty)
        // const updatedStock=product[0].stock-item.quantity
        // await updateProductByIdBroker(product[0].id,updatedStock)
        // console.log(item)
        // console.log('stock',product[0].stock-item.quantity)
        if(!product[0]){
            console.log('Product not found with product id',item.productId)
        }
        else{
            const updatedStock=product[0].stock-item.qty
            await updateProductByIdBroker(product[0].id,updatedStock)
            console.log('Product Updated please check the product stock')
        }
    });
}