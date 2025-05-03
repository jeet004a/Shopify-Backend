"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const moment_1 = __importDefault(require("moment"));
const db_1 = require("../db");
const pgUserSchema_1 = require("../DB/pgUserSchema");
const drizzle_orm_1 = require("drizzle-orm");
exports.redisClient = new ioredis_1.default("rediss://default:Ae7aAAIjcDE4YWU3ZWIzZjNkOGM0OWZkYmRlZjk5ZmE0MTc0YmM4Y3AxMA@sunny-lab-61146.upstash.io:6379");
const RATE_LIMIT_DURATION_IN_SECONDS = 20;
const NUMBER_OF_REQUESTS = 3;
const rateLimiter = async (req, res, next) => {
    try {
        const userEmail = req.user.email;
        const userId = await db_1.userDB.select({ user_id: pgUserSchema_1.user.id }).from(pgUserSchema_1.user).where((0, drizzle_orm_1.eq)(pgUserSchema_1.user.email, userEmail));
        //All details for redis configuration
        const currentTime = (0, moment_1.default)().unix();
        const result = await exports.redisClient.hgetall(userId[0].user_id.toString());
        // console.log('limit')
        if (result && Object.keys(result).length == 0) {
            const result = await exports.redisClient.hset(userId[0].user_id.toString(), {
                "createdAt": currentTime,
                "count": "1"
            });
            // console.log(result)
            return next();
        }
        // console.log(result)
        if (result) {
            const diff = currentTime - (+result.createdAt);
            if (diff > RATE_LIMIT_DURATION_IN_SECONDS) {
                await exports.redisClient.hset(userId[0].user_id.toString(), {
                    "createdAt": currentTime,
                    "count": "1"
                });
                return next();
            }
            if (+result["count"] >= NUMBER_OF_REQUESTS) {
                res.status(429).json({
                    message: "Too many requests. You are exceed your request limit"
                });
            }
            else {
                await exports.redisClient.hset(userId[0].user_id.toString(), {
                    "count": (+result["count"] + 1).toString()
                });
                return next();
            }
        }
        // next()
    }
    catch (error) {
        console.log('error from rate limiter', error);
    }
};
exports.rateLimiter = rateLimiter;
