const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const UserSchema = new Schema({
    firstName:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    lastName:{
        type:String,
        required: true,
        unique: true,
        trim: true,
    },
    username:{
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value){
            if (!validator.isEmail(value)){
                //subject to change to a custom response later
                throw new Error('Invalid Email');
            }
        }
    },
    phone: {
        type: String,
        required: true,
        validate(value){
            if(!/^\d{11,13}$/.test(value)){
                if(/[^\d]/.test(value)){
                    throw new Error('One or more invalid characters. Numbers only');
                }
                //subject to change to a custom response later
                throw new Error('Phone number should consist of 11 to 13 numbers');
            }
        }
    },
    password:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model("user_schema", UserSchema);