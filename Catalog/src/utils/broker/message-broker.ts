import { Consumer,Kafka, logLevel, Partitioners,Producer } from "kafkajs";
import { MessageType, OrderEvent, TOPIC_TYPE } from "../subscription.types";

const CLIENT_ID="order-servcie"    //order_servcie
const GROUP_ID='order-service-group'
const BROKER=['localhost:9092']

const kafka=new Kafka({
    clientId: CLIENT_ID,
    brokers: BROKER,
    logLevel: logLevel.INFO
})


export interface PublishType{
    headers:Record<string,any>;
    topic: TOPIC_TYPE;
    event: OrderEvent;
    message: Record<string,any>
}


let producer : Producer
let consumer: Consumer

export const createTopic=async(topic: string[])=>{
    const topics=topic.map((t)=>({
        topic: t,
        numPartitions: 2,
        replicationFactor: 1
    }))

    const admin=kafka.admin()

    await admin.connect()

    const topicExists=await admin.listTopics()
    console.log('topic exists',topicExists)

    for(let t of topics){
        if(!topicExists.includes(t.topic)){
            await admin.createTopics({
                topics: [t]
            })
        }
    }

    await admin.disconnect()
}


// export const connnectProducer=async<T>():Promise<T>=>{
//     await createTopic(['orderEvents'])
    
//     if(producer){
//         console.log('Producer already connected with the existing connection')
//         return producer as unknown as T
//     }

//     producer=kafka.producer({
//         createPartitioner: Partitioners.DefaultPartitioner
//     })    

//     await producer.connect()

//     console.log('Producer connected with the new connection')

//     return producer as unknown as T

// }


export const connnectProducer=async<T>():Promise<T>=>{
    // await createTopic(["OrderEvents"])

    if(producer){
        console.log("producer already connected with existing connection")
        return producer as unknown as T
    }

    producer=kafka.producer({
        createPartitioner: Partitioners.DefaultPartitioner
    })

    await producer.connect()
    console.log('producer connected with a new connection')

    return producer as unknown as T

}


export const disconnectProducer=async()=>{
    if(producer){
        await producer.disconnect()
    }
}



export const publish=async(data: PublishType): Promise<boolean>=>{
    const producer=await connnectProducer<Producer>()
    const result=await producer.send({
        topic: data.topic,
        messages:[
            {
                headers: data.headers,
                key: data.event,
                value: JSON.stringify(data.message)
            }
        ]
    })
    console.log('Publishing result',result)
    return result.length>0
}


export const connectConsumer=async<T>():Promise<T>=>{
    if(consumer){
        return consumer as unknown as T
    }

    consumer=kafka.consumer({
        groupId: GROUP_ID
    })

    await consumer.connect()
    return consumer as unknown as T
}


export const disconnectConsumer=async():Promise<void>=>{
    if(consumer){
        await consumer.disconnect()
    }
}


export const subscribe=async(messageHandler:any,topic:TOPIC_TYPE):Promise<void>=>{
    const consumer =await connectConsumer<Consumer>();
    await consumer.subscribe({topic: topic,fromBeginning:true})
    
    await consumer.run({
        eachMessage: async({topic,partition, message})=>{
            if(topic!="OrderEvents"){
                return
            }
            // if(topic!="CatalogEvents"){
            //     return
            // }
            // console.log('hello')
            if(message.key&&message.value){
                const inputMessage:MessageType={
                    headers: message.headers,
                    event: message.key.toString() as OrderEvent,
                    data: message.value? JSON.parse(message.value.toString()) : null
                }

                await messageHandler(inputMessage)
                await consumer.commitOffsets([
                    {topic, partition, offset: (Number(message.offset)+1).toString()}
                ])
            }
        }
    })
}


