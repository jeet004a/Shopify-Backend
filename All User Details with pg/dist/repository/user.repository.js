"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProfile = exports.SignIn = exports.SignUp = void 0;
const user_service_1 = require("../services/user.service");
const express_validator_1 = require("express-validator");
const user_model_1 = require("../DB/user.model");
const SignUp = async (req, res, next) => {
    try {
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            return res.status(401).json({ errors: errors.array() });
        }
        const UserDetails = await (0, user_service_1.SignUpService)(req.body);
        return res.status(201).json(UserDetails);
        // res.status(200).json({1:1})
    }
    catch (error) {
        throw new Error("Invalid Signup");
    }
};
exports.SignUp = SignUp;
const SignIn = async (req, res, next) => {
    try {
        const userData = await (0, user_service_1.SignInService)(req.body);
        return res.status(200).json(userData);
    }
    catch (error) {
        throw new Error("Invalid Signup");
    }
};
exports.SignIn = SignIn;
const UserProfile = async (req, res, next) => {
    try {
        // console.log(req.user)
        const { _id } = req.user;
        const data = await user_model_1.User.findById(_id);
        return res.status(200).json(data);
    }
    catch (error) {
        console.log(error);
        throw new Error("Error from User profile repository");
    }
};
exports.UserProfile = UserProfile;
// module.exports={
//     SignUpService,
//     SignInService
// }
