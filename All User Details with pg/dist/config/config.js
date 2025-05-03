"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TEST_DB_URL = exports.APP_SECRET = exports.DB_URL = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// module.exports={
//     PORT: process.env.PORT
// }
exports.PORT = process.env.PORT;
exports.DB_URL = process.env.DB_URL;
exports.APP_SECRET = process.env.APP_SECRET;
exports.TEST_DB_URL = process.env.TEST_DB_URL;
