import bcrypt from 'bcrypt'
import { Request } from 'express'
import jwt from 'jsonwebtoken'
import {APP_SECRET} from '../config/config'

declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}



import amqplib from 'amqplib'

export const genSalt=async()=>{
    return await bcrypt.genSalt()
}

export const genPassword =async(salt:any,password:string)=>{
    return await bcrypt.hash(password,salt)
}

export const comparePassword=async(enteredPassword:any, savedPassword: any,salt: any)=>{
    return (await genPassword(salt,enteredPassword))===savedPassword
}

export const generateSignature=async(payload: object)=>{
    try {
        return  jwt.sign(payload,APP_SECRET,) //{expiresIn: '5h'}
    } catch (error) {
        console.log(error)
    }
}



export const validateSignature = async(req:Request):Promise<any> => {
    
    try {
        for (let i = 0; i < req.rawHeaders.length; i++) {
            if (req.rawHeaders[i].split(" ")[0] === 'Bearer') {
                const token = req.rawHeaders[i].split(" ")[1]
                const payload = await jwt.verify(token, APP_SECRET)
                // console.log('abc',payload)
                // console.log("req")
                req.user=payload
                return true
            }
        }
    } catch (error) {
        console.log(error)   
    }

}


export const connectQueue=async()=>{
    try {
        let connection=await amqplib.connect('amqp://localhost')
        let channel=await connection.createChannel()

        await channel.assertQueue('test-queue')
    } catch (error) {
        console.log(error)
        throw new Error("While connecting to messageQueue");
        
    }
}



export const sendData =async(data:any)=> {
    // send data to queue
    let connection=await amqplib.connect('amqp://localhost')
    let channel=await connection.createChannel()
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
        
    // close the channel and connection
    await channel.close();
    await connection.close(); 
}

