"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInService = exports.SignUpService = void 0;
const user_model_1 = require("../DB/user.model");
const utils_1 = require("../utils");
// async function GeneratePassword(password: string) {
//     const salt=await genSalt()
//     const hasedPassword=await genPassword(salt,password)
//     return hasedPassword
// }
const SignUpService = async (payload) => {
    try {
        const { first_name, last_name, password, email } = payload;
        const existingUser = await user_model_1.User.findOne({ email: email });
        if (existingUser) {
            return "Email id already exist please user diffrent email";
        }
        const salt = await (0, utils_1.genSalt)();
        const hasedPassword = await (0, utils_1.genPassword)(salt, password);
        // console.log(userPassword)
        const UserDetails = new user_model_1.User({
            firstName: first_name,
            lastName: last_name,
            password: hasedPassword,
            email: email,
            salt
        });
        const Customer = await UserDetails.save();
        const token = await (0, utils_1.generateSignature)({ email: Customer.email, _id: Customer._id });
        // console.log(Customer)
        const userData = {
            _id: Customer._id,
            token: {
                token
            }
        };
        return userData;
        // return 1
    }
    catch (error) {
        throw new Error("Error from SignUp Service");
    }
};
exports.SignUpService = SignUpService;
const SignInService = async (payload) => {
    try {
        const { email, password } = payload;
        const existingUser = await user_model_1.User.findOne({ email: email });
        // console.log(existingUser)
        if (!existingUser) {
            return "Email Id is not exists";
        }
        const validateUser = await (0, utils_1.comparePassword)(password, existingUser.password, existingUser.salt);
        if (!validateUser) {
            return "Wrong Password";
        }
        const signature = await (0, utils_1.generateSignature)({ existingUser: existingUser.email, _id: existingUser._id });
        const data = {
            _id: existingUser._id,
            token: {
                signature
            }
        };
        return data;
    }
    catch (error) {
        // throw new Error("Error from Sigin Service");
        console.log(error);
    }
};
exports.SignInService = SignInService;
