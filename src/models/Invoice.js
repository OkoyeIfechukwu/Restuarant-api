const mongoose = require('mongoose')
const Schema = mongoose.Schema
const validator = require('validator')

const InvoiceSchema = new Schema({

    CustomerName:{
        type:String,
        required: true,
        trim: true,
    },
    OrderId: {
        type: String,
        required: true,
        trim: true,
    },
    Price: {
        type: Number,
    },
    OrderDetails: {
        type: String,
        trim: true,
    },
    OrderDate:{
        type: Date
    },
})


module.exports = mongoose.model("invoice_schema", InvoiceSchema);