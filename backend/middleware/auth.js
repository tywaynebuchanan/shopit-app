const AppError = require("../utils/errorHandler");
const catchAsync = require("./catchAsync");
const jwt = require('jsonwebtoken');
const User = require("../models/userModel");

//Check if user is authenicated or not
exports.isAuthenicated = catchAsync( async(req,res,next)=>{
    //Request token
    const { token } = req.cookies

    if(!token){
        return next(new AppError("You are not logged in",401));
    }
    //If token exist then verfy user
    const decoded = jwt.verify(token,process.env.SECRET);
    req.user = await User.findById(decoded.id);
    next();

})

exports.authorizedRoles = (...roles)=>{
    return (req,res,next) =>{
        if(!roles.includes(req.user.role)){
            return next( 
                new AppError("You are not allowed to access",403)
            )
        }
    next();
    }
}
