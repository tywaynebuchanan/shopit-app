const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({

    name:{
        type:String,
        required:[true,"A name of a product is required"],
        trim: true,
        maxLength:[100,"Product name can not be exceed 100 character"],
        unqiue: true
    },

    price:{
        type: Number,
        required:[true,"A name of a product is required"],
        maxLength:[5,"Product name can not be exceed 5 character"],
        default: 0.00
    },

    description:{
        type:String,
        required:[true,"Please enter product description"],
    },
    
    ratings:{
        type: Number,
        default: 0
    },

    images: [
        {
            public_id:{
                type: String,
                required: true
            },
            url:{
                type: String,
                required: true
            }
        }
    ],

    category: {
        type: String,
        required: [true, "Please select a category for this product"],
        enum:{
            values: [
                'Electronics',
                'Cameras',
                'Laptops',
                'Accessories',
                'Headphones',
                'Food',
                'Books',
                'Shoes',
                'Uniform'
            ],
            message: 'Please select the correct category for the product'
        }
    },

    seller:{
        type: String, 
        required: [true, "Please enter the seller of the product"],

    },
    stock:{
        type: Number,
        required: [true,'Please enter the product stock'],
        maxLength: [5,'Stock amount should not exceed 5']
    },

    numberofReviews: {
        type: Number,
        default: 0
    },

    reviews: [
        {

            user: {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required: true
            },
            name: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true,
                maxLength: [100,"Your comment exceeds 100 characters"]
            }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
})

const Product = mongoose.model('products',productSchema);

module.exports = Product;