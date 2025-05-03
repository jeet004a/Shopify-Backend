"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_Connection = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("../config/config");
const DB_Connection = async () => {
    try {
        if (!config_1.DB_URL) {
            throw new Error("DB URL missing");
        }
        await mongoose_1.default.connect(config_1.DB_URL);
        console.log('DB Connected');
        // console.log(DB_URL)
    }
    catch (error) {
        throw new Error("Error while connecting to DB");
    }
};
exports.DB_Connection = DB_Connection;
