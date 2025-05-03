"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv").config();
exports.default = {
    schema: './src/DB/pgUserSchema.ts',
    out: './drizzle', // where SQL migration files are stored
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DIRECT_URL,
    },
};
