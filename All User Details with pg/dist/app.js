"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = require("./config/config");
const user_routes_1 = __importDefault(require("./routes/user.routes"));
// const {PORT}=require('./config/config')
// const PORT=8000
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/user', user_routes_1.default);
// DB_Connection()
// dbConnection()
// connectQueue()
app.get('/', async (req, res, next) => {
    return res.status(200).json({ message: "Server is healthy" });
});
app.listen(config_1.PORT, () => {
    console.log('Server started at ', config_1.PORT);
});
exports.default = app;
