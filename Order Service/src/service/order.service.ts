import { orderDB } from "../db/order.connection";
import { orderLineItems, orders} from "../models/order.schema";
import { productDetails } from "../utils/api.calls"
import { clearUserCart, deleteCart, findCart } from "./cart.service"
import { v4 as uuidv4 } from "uuid";
import { eq,and } from "drizzle-orm"
import { publish } from "../utils/broker/message-broker";
import { OrderEvent } from "../utils/subscription.types";
export const CreateOrderService=async(customerId:number):Promise<any>=>{
    try {
        const cart : any=await findCart(customerId)
        // const response=await productDetails(productId)
        // cart.forEach(async(data: any)=>{
        //     let order_number=uuidv4()
        //     await orderDB.insert(orders).values({
        //         orderNumber: data.,
        //         customerId: 123,
        //         amount: 10,
        //         status: "Pending",
        //         txnId: 123,
        //     });
        // });
        // console.log(cart[0])

        //--------------------------------Logic for create order--------------------------------------
        let items=[]
        for(let i=0;i<cart.length;i++){
            items.push(cart[i].cart_line_items)
        }
        const id = uuidv4();
        let amount=0
        for(let data of items){
            // const response=await productDetails(data.productId)
            amount=amount+(data.qty*data.price)
        }
        
        await orderDB.insert(orders).values({
                orderNumber: id,
                customerId: cart[0].carts.customerId,
                amount: amount,
                status: "Pending",
                txnId: uuidv4(),
            });
        let orderDetails=await orderDB.select().from(orders).where(eq(orders.orderNumber,id))
        // console.log(orderDetails)

        cart.forEach(async(data: any)=>{
            const response=await productDetails(data.cart_line_items.productId)
            await orderDB.insert(orderLineItems).values({
                itemName: response[0].name,
                productId:response[0].id,
                qty: data.cart_line_items.qty,
                price: data.cart_line_items.price,
                orderId: orderDetails[0].id,
            })
        })

        //Below code is for clear cart
        await clearUserCart(customerId)
        return items
       //--------------------------------End create order logic-------------------------------------

    } catch (error) {
        console.log(error)
    }
}


export const getAllOrder=async(customerId:number)=>{
    const response=await orderDB.select().from(orders).where(eq(orders.customerId,customerId))

    if(!response){
        return "No order found"
    }

    return response
}

export const getOrderById=async(orderId:any)=>{
    try {
        let orderData=await orderDB.select().from(orders).where(eq(orders.orderNumber,orderId))
        let items=await orderDB.select().from(orderLineItems).where(eq(orderLineItems.orderId,orderData[0].id))
        
        console.log(items)
        return orderData
    } catch (error) {
        console.log(error)
    }
}


export const editOrderStatus=async(status:string,order_id:number,req:any)=>{
    try {
        // const response=await orderDB.update(orders).set({status:status}).where(eq(orders.orderNumber,order_id))

        let orderCheck=await orderDB.select().from(orders).where(eq(orders.id,order_id))
        if(orderCheck[0].status==="Canceled"){
            return "Order already cancelled"
        } else if(orderCheck[0].status==="Canceled"){
            return "Order already Completed"
        }
        if(status=='Canceled'){
            await orderDB.update(orders).set({status:status}).where(eq(orders.id,+order_id))
            let data=await orderDB.select().from(orderLineItems).where(eq(orderLineItems.orderId,+order_id))
            console.log(data)
            await publish({
                    topic: "OrderEvents",
                    headers: {token:req.headers.authorization},
                    event: OrderEvent.CANCEL_ORDER,
                    message:{
                        orderId:1,
                        items: data
                    }
                })
            return "Order Cancelled"
        }else if(status=='Completed'){
            await orderDB.update(orders).set({status:status}).where(eq(orders.id,+order_id))
            return "Order delivered"
        }
        return "Something went wrong"
    } catch (error) {
        console.log(error)
    }
}


export const HandleSubscription=async(message:any)=>{
    console.log('Message recieved by order Kafka Consumer',message)
}