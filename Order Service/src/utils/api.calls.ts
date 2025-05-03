import dotenv from 'dotenv'
import axios from 'axios'
dotenv.config()

const AUTH_SERVER=process.env.AUTH_SERVICE_URL || " http://localhost:7003"
const CATALOG_SERVICE=process.env.CATALOG_SERVICE_URL || "http://localhost:7002"



export const validateUser=async(token:string)=>{
    try {
        const response =await axios.get(`${AUTH_SERVER}/user/validate`,{
            headers: {
                Authorization: token
            }
        })
        if(response.status!=200){
            return false
        }
        return response.data
    } catch (error) {
        console.log(error)
    }
}


export const productDetails=async(productId:number)=>{
    try {
        const response =await axios.get(`${CATALOG_SERVICE}/product/${productId}`)
        // console.log(response)

        if(response.status!==200){
            return false
        }
        // console.log(response.data)
        return response.data
    } catch (error) {
        console.log(error)
    }
}