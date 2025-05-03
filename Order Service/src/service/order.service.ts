import { orderDB } from "../db/order.connection";
import { orderLineItems, orders} from "../models/order.schema";
import { productDetails } from "../utils/api.calls"
import { deleteCart, findCart } from "./cart.service"
import { v4 as uuidv4 } from "uuid";
import { eq,and } from "drizzle-orm"
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
        console.log(cart[0].cart_line_items.productId)
        let items=[]
        // items.push(cart[0].cart_line_items)
        // console.log(cart)
        for(let i=0;i<cart.length;i++){
            items.push(cart[i].cart_line_items)
        }
        cart.forEach(async(data:any)=>{
            const response=await productDetails(data.cart_line_items.productId)
            
            let amount=data.cart_line_items.qty*data.cart_line_items.price
            const id = uuidv4();
            await orderDB.insert(orders).values({
                orderNumber: id,
                customerId: data.carts.customerId,
                amount: amount,
                status: "Pending",
                txnId: uuidv4(),
            });
            let orderDetails=await orderDB.select().from(orders).where(eq(orders.orderNumber,id))

            await orderDB.insert(orderLineItems).values({
                itemName: response[0].name,
                qty: data.cart_line_items.qty,
                price: data.cart_line_items.price,
                orderId: orderDetails[0].id,
            })

            // await deleteCart(customerId)
            // console.log(data)
        })


        return items

        
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
        return orderData
    } catch (error) {
        console.log(error)
    }
}


export const editOrderStatus=async(status:string,order_id:string)=>{
    try {
        const response=await orderDB.update(orders).set({status:status}).where(eq(orders.orderNumber,order_id))
        // console.log(response)
        return "Updated"
    } catch (error) {
        console.log(error)
    }
}


export const HandleSubscription=async(message:any)=>{
    console.log('Message recieved by order Kafka Consumer',message)
}