import { delaerDb } from "../db/dealer.connection";
import { dealer } from "../models/dealer.schema";
import { generateSignature, genPassword, genSalt } from "../utils";
import { eq } from "drizzle-orm"

export const dealerSignup=async(payload: any)=>{
    try {
        let {username,email,password}=payload
        const dealerExists = await delaerDb.select().from(dealer).where(eq(dealer.email,email))
        if(dealerExists.length>0){
            return {"message":"Email id already exists"}
        }

        const salt=await genSalt()
        const hasedPassword=await genPassword(salt,password)

        const newUser = await delaerDb.insert(dealer).values({
            username: username,
            email: email,
            password: hasedPassword,
            salt:salt
        })
        
        const token =await generateSignature({email})
            
    
        return {
            "message":"user Created Sucessfully",
            "token":{
                token
            }
        }
    } catch (error) {
        throw new Error("Error from SignUp Service");
        
    }
}


export const dealerSiginService=async(payload:any)=>{
    try {  
        let {email,password}=payload

        const userExists = await delaerDb.select().from(dealer).where(eq(dealer.email,email))
        if(userExists.length==0){
            return  {"message":"Not authorized"}
        }
        let userData:any=userExists[0]
        const existingPassword=userData.password
        const enteredPassword=await genPassword(userData.salt,password)
        if(existingPassword!=enteredPassword){
            return {"message":"Worng email id or Password"}
        }

        const token =await generateSignature({email})
        // console.log()
        return {
            "email":userData?.email,
            "token":{
                token
            }
        }
        // return 1
    } catch (error) {
        // throw new Error("Error from Sigin Service");
        console.log(error)
        
    }
}