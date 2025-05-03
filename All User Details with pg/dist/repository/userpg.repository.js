"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatedUser = exports.UserDetailsById = exports.UserProfile = exports.SignIn = exports.SignUp = void 0;
// import { SignInService, SignUpService, UserProfileService } from '../services/userpg.service'
const userpg_service_1 = require("../services/userpg.service");
const config_1 = require("../config/config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SignUp = async (req, res, next) => {
    try {
        // console.log('Hello')
        const result = await (0, userpg_service_1.SignUpService)(req.body);
        //Below for create fake user
        // for(let i=0;i<50;i++){
        //     const userDetails={
        //         firstName: faker?.name?.firstName(),
        //         lastName: faker.name.lastName(),
        //         email: faker.internet.email(),
        //         password: faker.internet.password(),
        //         salt:faker.internet.password(),
        //     }
        //     const salt=await genSalt()
        //     const hasedPassword=await genPassword(salt,userDetails.password)
        //     userDetails.password=hasedPassword
        //     userDetails.salt=salt
        //     await userDB.insert(user).values(userDetails)
        // }
        return res.status(201).json(result);
    }
    catch (error) {
        throw new Error("Invalid Signup");
    }
};
exports.SignUp = SignUp;
const SignIn = async (req, res, next) => {
    try {
        // let {email,password }=req.body
        const existingUser = await (0, userpg_service_1.SignInService)(req.body);
        return res.status(200).json(existingUser);
    }
    catch (error) {
        throw new Error("Invalid Signup");
    }
};
exports.SignIn = SignIn;
const UserProfile = async (req, res, next) => {
    try {
        // console.log(req.user)
        // const {_id}=req.user
        // const data=await User.findById(_id)
        const { email } = req.user;
        let result = await (0, userpg_service_1.UserProfileService)({ email });
        // console.log(req.user)
        return res.status(200).json(result);
    }
    catch (error) {
        console.log(error);
        throw new Error("Error from User profile repository");
    }
};
exports.UserProfile = UserProfile;
const UserDetailsById = async (req, res, next) => {
    try {
        const { email } = req.user;
        if (!email) {
            return res.status(401).json({ "message": "Not authorized" });
        }
        // const {id}=req.params
        const userDetails = await (0, userpg_service_1.userById)(req.params);
        if (!userDetails) {
            return res.status(401).json({ "message": "User Not Found with this id" });
        }
        // console.log(userDetails)
        return res.status(200).json(userDetails);
    }
    catch (error) {
        console.log(error);
    }
};
exports.UserDetailsById = UserDetailsById;
const validatedUser = async (req, res, next) => {
    try {
        const token = req.headers["authorization"];
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const tokenData = token.split(" ")[1];
        const payload = await jsonwebtoken_1.default.verify(tokenData, config_1.APP_SECRET);
        // if(!payload){
        //     return res.status(401).json({message: "Unauthorized"})
        // }
        // const userData=await UserProfileService(payload)
        if (typeof payload === "object" && "email" in payload) {
            const user = await (0, userpg_service_1.UserProfileService)({ email: payload.email });
            // console.log(user)
            return res.status(200).json(user);
        }
        else {
            return res.status(401).json({ message: "Invalid token payload" });
        }
    }
    catch (error) {
        return res.status(403).json({ message: "Invalide token" });
    }
};
exports.validatedUser = validatedUser;
// module.exports={
//     SignUpService,
//     SignInService
// }
