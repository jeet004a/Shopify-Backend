"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendData = exports.connectQueue = exports.validateSignature = exports.generateSignature = exports.comparePassword = exports.genPassword = exports.genSalt = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("../config/config");
const amqplib_1 = __importDefault(require("amqplib"));
const genSalt = async () => {
    return await bcrypt_1.default.genSalt();
};
exports.genSalt = genSalt;
const genPassword = async (salt, password) => {
    return await bcrypt_1.default.hash(password, salt);
};
exports.genPassword = genPassword;
const comparePassword = async (enteredPassword, savedPassword, salt) => {
    return (await (0, exports.genPassword)(salt, enteredPassword)) === savedPassword;
};
exports.comparePassword = comparePassword;
const generateSignature = async (payload) => {
    try {
        return jsonwebtoken_1.default.sign(payload, config_1.APP_SECRET, { expiresIn: '5h' });
    }
    catch (error) {
        console.log(error);
    }
};
exports.generateSignature = generateSignature;
const validateSignature = async (req) => {
    try {
        for (let i = 0; i < req.rawHeaders.length; i++) {
            if (req.rawHeaders[i].split(" ")[0] === 'Bearer') {
                const token = req.rawHeaders[i].split(" ")[1];
                const payload = await jsonwebtoken_1.default.verify(token, config_1.APP_SECRET);
                // console.log('abc',payload)
                // console.log("req")
                req.user = payload;
                return true;
            }
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.validateSignature = validateSignature;
const connectQueue = async () => {
    try {
        let connection = await amqplib_1.default.connect('amqp://localhost');
        let channel = await connection.createChannel();
        await channel.assertQueue('test-queue');
    }
    catch (error) {
        console.log(error);
        throw new Error("While connecting to messageQueue");
    }
};
exports.connectQueue = connectQueue;
const sendData = async (data) => {
    // send data to queue
    let connection = await amqplib_1.default.connect('amqp://localhost');
    let channel = await connection.createChannel();
    await channel.sendToQueue("test-queue", Buffer.from(JSON.stringify(data)));
    // close the channel and connection
    await channel.close();
    await connection.close();
};
exports.sendData = sendData;
