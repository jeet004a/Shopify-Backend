import mongoose from 'mongoose'
import { DB_URL } from '../config/config';

export const DB_Connection=async()=>{
    try {
        if(!DB_URL){
            throw new Error("DB URL missing");
            
        }
        await mongoose.connect(DB_URL)

        console.log('DB Connected')
        // console.log(DB_URL)

    } catch (error) {
        throw new Error("Error while connecting to DB");
        
    }
}