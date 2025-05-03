import {User} from '../DB/user.model'
import { genSalt,genPassword, comparePassword, generateSignature } from '../utils'


// async function GeneratePassword(password: string) {
//     const salt=await genSalt()
//     const hasedPassword=await genPassword(salt,password)
//     return hasedPassword
// }

export const SignUpService=async(payload: any)=>{
    try {
    
        const {first_name,last_name,password,email}=payload

        const existingUser=await User.findOne({email:email})

        if(existingUser){
            return "Email id already exist please user diffrent email"
        }
        const salt=await genSalt()
        const hasedPassword=await genPassword(salt,password)
        // console.log(userPassword)
        const UserDetails=new User({
            firstName: first_name,
            lastName: last_name,
            password:hasedPassword,
            email:email,
            salt
        })

        const Customer=await UserDetails.save()
        const token=await generateSignature({email: Customer.email,_id: Customer._id})
        // console.log(Customer)
        const userData={
            _id: Customer._id,
            token:{
                token
            }
        }

        return userData
        // return 1

        
    } catch (error) {
        throw new Error("Error from SignUp Service");
        
    }
}


export const SignInService=async(payload: any)=>{
    try {  
        const {email,password}=payload
        const existingUser=await User.findOne({email: email})
        // console.log(existingUser)
        if(!existingUser){
            return "Email Id is not exists"
        }
        const validateUser=await comparePassword(password,existingUser.password,existingUser.salt)
        if(!validateUser){
            return "Wrong Password"
        }

        const signature=await generateSignature({existingUser: existingUser.email,_id: existingUser._id})
        const data={
            _id:existingUser._id,
            token: {
                signature
            }
        }
        return data
    } catch (error) {
        // throw new Error("Error from Sigin Service");
        console.log(error)
        
    }
}