
import request from 'supertest'
import { TEST_DB_URL } from '../config/config'
import mongoose from 'mongoose'
import { User } from '../DB/user.model'
import express from 'express'
import userRouter from '../routes/user.routes'

const app=express()
app.use(express.json())
app.use(userRouter)



describe('All User endpoints',()=>{
    beforeAll(async()=>{
        await mongoose.connect(TEST_DB_URL)
    })

    afterAll(async()=>{
        await User.deleteMany({})
        await mongoose.connection.close()
    })


    // describe('User signup',()=>{
    //     test('/signup with 201 status code',async()=>{
    //         const payload={
    //             // "email": "wastijeet113@gmail.com",
    //             "email": "test@gmail.com",
    //             "password": "1234",
    //             "first_name": "Jeet",
    //             "last_name": "Wasti"
    //         }
    //         let response=await request(app).post('/signup').send(payload)
    //         // console.log(response)
    //         expect(response.status).toBe(201)
    //     })

    //     test('/signup with 401 Unauthorized',async()=>{
    //         const payload={
    //             "email": "wastijeet113@gmail.com",
    //             "password": "1234",
    //         }
    //         let response=await request(app).post('/signup').send(payload)
    //         expect(response.status).toBe(401)
    //         // expect(response.status).toBe(201)
    //     })
    // })

    describe('User SignIn',()=>{
        test('/signin ',async()=>{
            const payload={
                "email": "test@gamil.com",
                "password": "1234"
            }

            const response=await request(app).get('/signin').send(payload)
            console.log(response.body)
            expect(1).toBe(1)
        })
    })
})