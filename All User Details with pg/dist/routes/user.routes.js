"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_validator_1 = require("express-validator");
// import UserRepository from '../repository/user.repository'
// import UserRepository from '../repository/user.repository'
// import {SignUp,SignIn,UserProfile} from '../repository/userpg.repository'
const userpg_repository_1 = require("../repository/userpg.repository");
const user_auth_1 = require("../middlewares/user.auth");
const utils_1 = require("../utils");
// import { SignUpService } from '../services/userpg.service'
const router = express_1.default.Router();
router.post('/signup', (0, express_validator_1.body)('email').isEmail().withMessage('Invalid Email id'), (0, express_validator_1.body)('password').isLength({ min: 3 }).withMessage('Password must be 3 character long'), (0, express_validator_1.body)('first_name').isString().isLength({ min: 3 }).withMessage('First Name sould be more than 3 character'), (0, express_validator_1.body)('last_name').isString().isLength({ min: 3 }).withMessage('First Name sould be more than 3 character'), userpg_repository_1.SignUp);
router.get('/signin', userpg_repository_1.SignIn);
router.get('/profile', user_auth_1.UserAuth, userpg_repository_1.UserProfile); //rateLimiter
router.get('/validate', userpg_repository_1.validatedUser);
router.get('/:id', user_auth_1.UserAuth, userpg_repository_1.UserDetailsById);
router.get('/send-message', (req, res) => {
    const data = {
        title: "Six of Crows",
        author: "Leigh Burdugo"
    };
    (0, utils_1.sendData)(data);
    res.send("Message Sent");
});
router.get('/health', (req, res) => {
    res.send("Server is up and running");
});
exports.default = router;
