import mongoose from "mongoose";

const UserSchema=new mongoose.Schema({
    firstName: {
        type: String,
        require: true
    },
    lastName:{
        type: String
    },
    password:{
        type: String,
        require: true,
    },
    email:{
        type:String,
        require: true
    },
    salt:{
        type: String
    }
}, {
    toJSON: {
        transform(doc, ret) {
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
        }
    },
    timestamps: true
})

export const User=mongoose.model('User',UserSchema)
