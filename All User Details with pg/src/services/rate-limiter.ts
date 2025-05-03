import { NextFunction, Request, Response } from 'express'
import Redis from 'ioredis'
import moment from 'moment'
import { userDB } from '../db'
import { user } from '../DB/pgUserSchema'
import {eq} from 'drizzle-orm'



export const redisClient = new Redis("rediss://default:Ae7aAAIjcDE4YWU3ZWIzZjNkOGM0OWZkYmRlZjk5ZmE0MTc0YmM4Y3AxMA@sunny-lab-61146.upstash.io:6379")


const RATE_LIMIT_DURATION_IN_SECONDS=20
const NUMBER_OF_REQUESTS=3

export const rateLimiter=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const userEmail=req.user.email
        const userId=await userDB.select({user_id:user.id}).from(user).where(eq(user.email,userEmail))
        
        //All details for redis configuration
        const currentTime=moment().unix()
        const result=await redisClient.hgetall(userId[0].user_id.toString())
        // console.log('limit')
        
        if(result && Object.keys(result).length==0){
            const result=await redisClient.hset(userId[0].user_id.toString(),{
                "createdAt":currentTime,
                "count":    "1"
            })
            // console.log(result)
            return next()
        }

        // console.log(result)

        if(result){
            const diff=currentTime-(+result.createdAt)
            if(diff>RATE_LIMIT_DURATION_IN_SECONDS){
                await redisClient.hset(userId[0].user_id.toString(),{
                    "createdAt":currentTime,
                    "count":    "1"
            })
            return next()
        }

        if(+result["count"]>=NUMBER_OF_REQUESTS){
            res.status(429).json({
                message:"Too many requests. You are exceed your request limit"
            })
        }
        else{
            await redisClient.hset(userId[0].user_id.toString(),{
                "count":(+result["count"]+1).toString()
            })
            return next()
        }
    }
        // next()
} 
catch (error) {
        console.log('error from rate limiter',error)
    }
}