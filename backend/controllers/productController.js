const Product = require("../models/productModel");
const AppError = require("../utils/errorHandler");
const catchAsync = require("../middleware/catchAsync");
const ApiFeatures = require("../utils/apiFeatures");

exports.getProducts = catchAsync(async (req,res,next) =>{

        const resPerPage = 20;
        const productCount = await Product.countDocuments()
        const apiFeatures = new ApiFeatures(Product.find(),req.query)
        .search()
        .filter()
        .pagination(resPerPage);

        const allProducts = await apiFeatures.query;

        if(!allProducts){
            return next(new AppError('Unable to get all products',401));
        }
        res.status(200).json({
            status: "success",
            products: allProducts.length,
            productCount: productCount,
            data:{
                allProducts
            }
        })
   
})

exports.getProductById = catchAsync(async (req,res,next)=>{
    
        const getProductById = await Product.findById(req.params.id);
        if(!getProductById){
            return next(new AppError("Unable to get the product by that Id",404))
        }
        res.status(200).json({
            status: "success",
            data:{
                getProductById
            }
        })
  
        
    
})

exports.createProduct = catchAsync(async (req,res,next)=>{

    //Making sure that the user is captured when creating the product
        req.body.user = req.user.id;
        const newProduct = await Product.create(req.body);
        
        if(!newProduct){
            return next(new AppError("Unable to add the new product",400));
        }
        res.status(201).json({
            status: "success",
            message: "Product was added",
            data:{
                newProduct
            }
        })
  
})

exports.updateProduct = catchAsync(async(req,res,next)=>{
    const updateProduct = await Product.findByIdAndUpdate(req.params.id,req.body,
        {
            new: true,
            runValidators: true,
    });

    if(!updateProduct){
       return next(new AppError(`Unable to update the product by this id: ${req.params.id}`));
    }

    res.status(200).json({
        status: "success",
        data:{
            updateProduct
        }
    })
})

exports.deleteProduct = catchAsync(async(req,res,next)=>{

    const deleteProduct = await Product.findById(req.params.id);

    if(!deleteProduct){
        return next(new AppError("Unable to find product by that Id",204))
    }

    await Product.remove();

    res.status(202).json({
        status: "success",
        message:"The product was deleted"
    })
})