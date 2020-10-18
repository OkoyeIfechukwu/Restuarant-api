const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const OrderSchema = new Schema({
    OrderId: {
        type: String,
        unique: true,
        length: 12
    },
    OrderDetails: {
        type: String,
        trim: true
    },
    Price: {
        type: Number,
        required: true,
        default: 0,
        trim: true,
        validate(value){
            if(value <= 0) {
                throw new Error('Price cannot be 0');
            }
        }
    },
    Plates: {
        type: Number,
        default: 1,
        trim: true,
        validate(value){
            if (value <= 0){
                throw new Error('Number of plates cannot be 0 or less')
            }
        }
    },
    OrderDate:{
        type: Date
    },
    Active:{
        type: String,
        enum:['ACTIVE', 'RESOLVED'],
        default: 'ACTIVE'
    },
    UserId: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Order_schema", OrderSchema);