import { NextFunction, Request, Response } from "express";
import { publish } from "../utils/broker/message-broker";
import { OrderEvent } from "../utils/subscription.types";
import { CreateOrderService, editOrderStatus, getAllOrder, getOrderById } from "../service/order.service";

export const createOrderContoller=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
    //     await publish({
    //     topic: "OrderEvents",
    //     headers: {token:req.headers.authorization},
    //     event: OrderEvent.CREATE_ORDER,
    //     message:{
    //         orderId:1,
    //         items:[
    //             {
    //                 productId:25,
    //                 quantity:1
    //             },
    //             {
    //                 productId:26,
    //                 quantity:2
    //             }
    //         ]
    //     }
    // })

    const data=await CreateOrderService(req.user.user_id)
    // console.log('data',data)
        await publish({
        topic: "OrderEvents",
        headers: {token:req.headers.authorization},
        event: OrderEvent.CREATE_ORDER,
        message:{
            orderId:1,
            items: data
        }
    })
    return res.status(200).json("Hello create order")
    } catch (error) {
        console.log(error)
    }
}

export const getAllOrderRecordsController=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        
        const response=await getAllOrder(req.user.user_id)
        // console.log(req.user)
        return res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const getOrderByIdController=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        let orderId=req.params.id
        // console.log()
        const data=await getOrderById(orderId)
        return res.status(200).json(data)
        // return res.status(200).json("Hello from get all order records by id")
    } catch (error) {
        console.log(error)
    }
}


//Call only broker service
export const editOrderByidController=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        let orderId=+req.params.id
        let status=req.body.status
        const data=await editOrderStatus(status,orderId,req)
        return res.status(200).json(data)
    } catch (error) {
        console.log(error)
    }
}

export const deleteOrderByIdController=async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try {
        return res.status(200).json("Not implemented yet ! thanks ")
    } catch (error) {
        console.log(error)
    }
}