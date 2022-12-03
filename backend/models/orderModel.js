const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({

    shippingInfo:{
        address: {
            type: String,
            required: [true, "We are unable to process the order without an address"]
        },
        parish:{
            type: String,
            required:[true, "A parish is required"]
        },
        phonenumber:{
            type:String,
            required: [true, "A phone number is required"]
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    orderItems:[
        {
            name:{
                type: String,
                required: true
            },
            quantity: {
                type: String,
                required: true,
            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true,
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: "Product"
            } 
        }  
    ],
    paymentInfo: {
        id: {
            type: String,  
        },
        status: {
            type: String
        }
    },
    paidAt:{
        type: Date,
    },

    itemsPrice: {
        type: Number,
        required: true,
        default: 0.00
    },
    taxPrice:{
        type: Number,
        required: true,
        default: 0.00
    },
    shippingPrice:{
        type: Number,
        required: true,
        default: 0.00
    },
    totalPrice: {
        type: Number,
        required: true,
    },
    orderStatus:{
        type: String,
        required: true,
        default: "Processing"
    },
    deliveredAt: {
        type: Date,
    },
    createdAt:{
        type: Date,
        default: Date.now 
    }


})

const Order = mongoose.model("orders",orderSchema);
module.exports = Order;