import { Consumer, Producer } from "kafkajs"
import { connectConsumer, connnectProducer, subscribe } from "../utils/broker/message-broker"
import { handleBrokerMessage } from "./catalog.service"

export const InitiallizeBroker=async()=>{
    const producer=await connnectProducer<Producer>()

    producer.on("producer.connect",()=>{
        console.log('Order service producer connected successfully')
    })

    const consumer=await connectConsumer<Consumer>()

    consumer.on("consumer.connect",()=>{
        console.log('Order service consumer connected successfully')
    })

    await subscribe(handleBrokerMessage,"OrderEvents")

    // await producer.connect()
    // console.log('Kafka is connected!')
    // await producer.disconnect()
}