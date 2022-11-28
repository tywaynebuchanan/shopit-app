const catchAsync = require("../middleware/catchAsync");
const Order = require("../models/orderModel");
const Product = require("../models/productModel")
const AppError = require("../utils/errorHandler");


exports.placeorder = catchAsync(async(req,res,next)=>{

    const {
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    } = req.body;

    const newOrder = await Order.create({
        orderItems,
        shippingInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt: Date.now(),
        user: req.user._id
    });

    // if(!newOrder){
    //     return next(new AppError("Unable to process order", 400));
    // }

    res.status(200).json({
        status: "success",
        data:{
            newOrder
        }
    })
})

exports.singleOrder = catchAsync(async(req,res,next)=>{
    const singleorder = await Order.findById(req.params.id);

    if(!singleorder){
        return next(new AppError("We could not find an order that id", 401))
    }

    res.status(200).json({
        status: "success",
        data:{
            singleorder
        }
    })
})
//Admin route /api/v1/admin/
exports.getAllOrders = catchAsync(async(req,res,next)=>{
    const getallorders = await Order.find();

    let ordertotal = 0;
    getallorders.forEach(order=>{
        ordertotal += order.totalPrice;
    })
    if(!getallorders){
        return next(new AppError("Unable to get all Orders", 401))
    }

    res.status(200).json({
        status: "success",
        totalorders: ordertotal,
        data:{
            getallorders
        }
    })
})

exports.myOrders = catchAsync(async(req,res,next)=>{
    const myorders = await Order.find({user: req.user.id});

    res.status(200).json({
        status: "success",
        totalorders: myorders.length,
        data:{
            myorders
        }

    })
})