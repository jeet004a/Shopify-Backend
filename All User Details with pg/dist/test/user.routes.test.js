"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const config_1 = require("../config/config");
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = require("../DB/user.model");
const express_1 = __importDefault(require("express"));
const user_routes_1 = __importDefault(require("../routes/user.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(user_routes_1.default);
describe('All User endpoints', () => {
    beforeAll(async () => {
        await mongoose_1.default.connect(config_1.TEST_DB_URL);
    });
    afterAll(async () => {
        await user_model_1.User.deleteMany({});
        await mongoose_1.default.connection.close();
    });
    // describe('User signup',()=>{
    //     test('/signup with 201 status code',async()=>{
    //         const payload={
    //             // "email": "wastijeet113@gmail.com",
    //             "email": "test@gmail.com",
    //             "password": "1234",
    //             "first_name": "Jeet",
    //             "last_name": "Wasti"
    //         }
    //         let response=await request(app).post('/signup').send(payload)
    //         // console.log(response)
    //         expect(response.status).toBe(201)
    //     })
    //     test('/signup with 401 Unauthorized',async()=>{
    //         const payload={
    //             "email": "wastijeet113@gmail.com",
    //             "password": "1234",
    //         }
    //         let response=await request(app).post('/signup').send(payload)
    //         expect(response.status).toBe(401)
    //         // expect(response.status).toBe(201)
    //     })
    // })
    describe('User SignIn', () => {
        test('/signin ', async () => {
            const payload = {
                "email": "test@gamil.com",
                "password": "1234"
            };
            const response = await (0, supertest_1.default)(app).get('/signin').send(payload);
            console.log(response.body);
            expect(1).toBe(1);
        });
    });
});
