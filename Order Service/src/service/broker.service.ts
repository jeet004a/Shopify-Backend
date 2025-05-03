import { Producer,Consumer, Partitioners } from "kafkajs";
import { connectConsumer, connnectProducer, publish, subscribe } from "../utils/broker/message-broker";
import { OrderEvent } from "../utils/subscription.types";
import { HandleSubscription } from "./order.service";


// import { Kafka, logLevel } from 'kafkajs' // Make sure you import logLevel from KafkaJS

// const CLIENT_ID = "order-service"; // Corrected typo
// const GROUP_ID = 'order-service-group';
// const BROKER = ['localhost:9092'];  // Use port 9094 here, matching the advertised listener

// const kafka = new Kafka({
//     clientId: CLIENT_ID,
//     brokers: BROKER,
//     logLevel: logLevel.INFO  // Correct logLevel usage
// });

// const producer = kafka.producer({
//     createPartitioner: Partitioners.DefaultPartitioner
// })

export const InitiallizeBroker=async()=>{
    const producer=await connnectProducer<Producer>()

    producer.on("producer.connect",()=>{
        console.log('Order service producer connected successfully')
    })

    const consumer=await connectConsumer<Consumer>()

    consumer.on("consumer.connect",()=>{
        console.log('Order service consumer connected successfully')
    })

    await subscribe(HandleSubscription,"OrderEvents")

    // await producer.connect()
    // console.log('Kafka is connected!')
    // await producer.disconnect()
}

export const SendCreateOrderMessage=async(data:any)=>{
    await publish({
        event:OrderEvent.CREATE_ORDER,
        topic: "CatalogEvents",
        headers:{},
        message:data
    })
}


export const SendOrderCancel=async(data:any)=>{
    await publish({
        event:OrderEvent.CANCEL_ORDER,
        topic:"CatalogEvents",
        headers:{},
        message:data
    })
}
