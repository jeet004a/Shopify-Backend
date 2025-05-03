"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userById = exports.UserProfileService = exports.SignInService = exports.SignUpService = void 0;
const utils_1 = require("../utils");
const db_1 = require("../db");
const pgUserSchema_1 = require("../DB/pgUserSchema");
const drizzle_orm_1 = require("drizzle-orm");
const SignUpService = async (payload) => {
    try {
        let { first_name, last_name, email, password } = payload;
        first_name = first_name[0].toUpperCase() + first_name.slice(1);
        last_name = last_name[0].toUpperCase() + last_name.slice(1);
        // const userExists = await userDB.query("SELECT * FROM users WHERE email = $1", [
        //             email,
        //           ]);
        const userExists = await db_1.userDB.select().from(pgUserSchema_1.user).where((0, drizzle_orm_1.eq)(pgUserSchema_1.user.email, email));
        // if(userExists.rows.length>0){
        //     return {"message":"Email id already exists"}
        // }
        if (userExists.length > 0) {
            return { "message": "Email id already exists" };
        }
        const salt = await (0, utils_1.genSalt)();
        const hasedPassword = await (0, utils_1.genPassword)(salt, password);
        // const newUser = await db.query(
        //     "INSERT INTO users (first_name, last_name, email, hasedPassword,salt) VALUES($1, $2, $3, $4, $5) RETURNING *",
        //     [first_name, last_name, email, hasedPassword, salt]
        //     );
        const newUser = await db_1.userDB.insert(pgUserSchema_1.user).values({
            firstName: first_name,
            lastName: last_name,
            email: email,
            password: hasedPassword,
            salt: salt
        });
        const token = await (0, utils_1.generateSignature)({ email });
        return {
            "message": "user Created Sucessfully",
            "token": {
                token
            }
        };
    }
    catch (error) {
        throw new Error("Error from SignUp Service");
    }
};
exports.SignUpService = SignUpService;
function postgres(connectionString, arg1) {
    throw new Error('Function not implemented.');
}
const SignInService = async (payload) => {
    try {
        let { email, password } = payload;
        // const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
        //             email,
        //     ]);
        const userExists = await db_1.userDB.select().from(pgUserSchema_1.user).where((0, drizzle_orm_1.eq)(pgUserSchema_1.user.email, email));
        if (userExists.length == 0) {
            return { "message": "Not authorized" };
        }
        // console.log(userExists)
        let userData = userExists[0];
        // const existingPassword=userData?.hasedpassword
        const existingPassword = userData.password;
        const enteredPassword = await (0, utils_1.genPassword)(userData.salt, password);
        // console.log(existingPassword)
        // console.log(enteredPassword)
        if (existingPassword != enteredPassword) {
            return { "message": "Worng email id or Password" };
        }
        const token = await (0, utils_1.generateSignature)({ email });
        // console.log()
        return {
            "email": userData?.email,
            "token": {
                token
            }
        };
        // return 1
    }
    catch (error) {
        // throw new Error("Error from Sigin Service");
        console.log(error);
    }
};
exports.SignInService = SignInService;
const UserProfileService = async (payload) => {
    try {
        let { email } = payload;
        const userDetails = await db_1.userDB.select({ firstName: pgUserSchema_1.user.firstName, lastName: pgUserSchema_1.user.lastName,
            email: pgUserSchema_1.user.email, user_id: pgUserSchema_1.user.id
        }).from(pgUserSchema_1.user).where((0, drizzle_orm_1.eq)(pgUserSchema_1.user.email, email));
        return userDetails[0];
        // return userExists.rows[0]
        return 1;
    }
    catch (error) {
        console.log(error);
    }
};
exports.UserProfileService = UserProfileService;
const userById = async (payload) => {
    try {
        const { id } = payload;
        const userDetails = await db_1.userDB.select({ email: pgUserSchema_1.user.email }).from(pgUserSchema_1.user).where((0, drizzle_orm_1.eq)(pgUserSchema_1.user.id, id));
        return userDetails[0];
    }
    catch (error) {
        console.log(error);
    }
};
exports.userById = userById;
