import {User} from '../DB/user.model'
import { genSalt,genPassword, comparePassword, generateSignature } from '../utils'
import {userDB} from '../db'
import {user} from '../DB/pgUserSchema'
import {eq} from 'drizzle-orm'
import { drizzle } from 'drizzle-orm/postgres-js'

export const SignUpService=async(payload: any)=>{
    try {
        let {first_name,last_name,email,password}=payload
        first_name = first_name[0].toUpperCase() + first_name.slice(1);
        last_name = last_name[0].toUpperCase() + last_name.slice(1);

        // const userExists = await userDB.query("SELECT * FROM users WHERE email = $1", [
        //             email,
        //           ]);

        const userExists = await userDB.select().from(user).where(eq(user.email,email))
        // if(userExists.rows.length>0){
        //     return {"message":"Email id already exists"}
        // }

        if(userExists.length>0){
            return {"message":"Email id already exists"}
        }

        const salt=await genSalt()
        const hasedPassword=await genPassword(salt,password)
        // const newUser = await db.query(
        //     "INSERT INTO users (first_name, last_name, email, hasedPassword,salt) VALUES($1, $2, $3, $4, $5) RETURNING *",
        //     [first_name, last_name, email, hasedPassword, salt]
        //     );

        const newUser = await userDB.insert(user).values({
                firstName: first_name,
                lastName: last_name,
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



function postgres(connectionString: string | undefined, arg1: { prepare: boolean }) {
    throw new Error('Function not implemented.')
}


export const SignInService=async(payload: any)=>{
    try {  
        let {email,password}=payload

        // const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
        //             email,
        //     ]);

        const userExists = await userDB.select().from(user).where(eq(user.email,email))
        if(userExists.length==0){
            return  {"message":"Not authorized"}
        }

        // console.log(userExists)
        let userData:any=userExists[0]
        // const existingPassword=userData?.hasedpassword
        const existingPassword=userData.password
        const enteredPassword=await genPassword(userData.salt,password)
        // console.log(existingPassword)
        // console.log(enteredPassword)
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


export const UserProfileService=async(payload:any)=>{
    try {
        let {email}=payload


        const userDetails=await userDB.select({firstName: user.firstName,lastName:user.lastName
            ,email:user.email, user_id:user.id
        }).from(user).where(eq(user.email,email))

        
        return userDetails[0]
    // return userExists.rows[0]
    return 1
    } catch (error) {
        console.log(error)
    }
}


export const userById=async(payload:any)=>{
    try {
        const {id}=payload
        const userDetails=await userDB.select({email: user.email}).from(user).where(eq(user.id,id))
        
        return userDetails[0]
    } catch (error) {
        console.log(error)
    }
}