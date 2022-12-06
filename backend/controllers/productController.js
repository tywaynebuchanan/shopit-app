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

        const products = await apiFeatures.query;

        if(!products){
            return next(new AppError('Unable to get all products',401));
        }

        setTimeout(()=>{
            res.status(200).json({
                status: "success",
                productCount: productCount,
                products
                
            })
        },2000)
        
   
})

exports.getProductById = catchAsync(async (req,res,next)=>{
    
        const product = await Product.findById(req.params.id);
        if(!product){
            return next(new AppError("Unable to get the product by that Id",404))
        }
        res.status(200).json({
            status: "success",
            product
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

// Create Reviews of Product /api/v1/review

exports.addreview = catchAsync(async(req,res,next)=>{

    const {rating,comment, productId} = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }


    const product = await Product.findById(productId);

    //Find out if the product is already reviewed by the logged in user
    const isReviewed = product.reviews.find(
        // r = review
        r => r.user.toString() === req.user._id.toString()
    )

    if(isReviewed){
        product.reviews.forEach(review =>{
            if(review.user.toString() === req.user._id.toString()){
                review.comment = comment;
                review.rating = rating
            }
        })
    }else{
        product.reviews.push(review);
        product.numberofReviews = product.reviews.length
    }

    //Find the average of the ratings for each product
    product.ratings = product.reviews.reduce((acc,item)=>item.rating + acc, 0 ) / product.reviews.length;

    //save reviews
    await product.save({validateBeforeSave: false});

    res.status(200).json({
        status:"success",
        message: "The review was added"
    })
})

exports.getallreviews = catchAsync(async(req,res,next)=>{
    const getreviews = await Product.findById(req.query.id);

    if(!getreviews){
        return next(new AppError("There are no reviews for this product", 400))
    }

    res.status(200).json({
        status: "success",
        reviews: getreviews.reviews
    })
})

// exports.deletereview = catchAsync(async(req,res,next)=>{
//     const product = await Product.findById(req.query.productId);

//     //Filter the reviews before deleting
//     const reviews = product.reviews.filter(review => review._id.toString() !== req.query.id.toString())

//     const numberofReviews = reviews.length;

//     const ratings = product.reviews.reduce((acc,item)=>item.rating + acc, 0 ) / reviews.length;

//     await Product.findByIdAndUpdate(req.query.productId,{
//         reviews,
//         ratings,
//         numberofReviews
//     },{
//         new: true,
//         runValidators: true,
//         // useFindandModify: true

//     });


//     res.status(200).json({
//         status: "success",
//         reviews: getreviews.reviews
//     })
// })