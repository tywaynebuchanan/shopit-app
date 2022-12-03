const catchAsync = require("../middleware/catchAsync");
const User = require("../models/userModel");
const AppError = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require('crypto');

exports.registerUser = catchAsync(async (req,res,next)=>{
    const {name,email,password} = req.body;

    const user = await User.create({
        name,
        email,
        password,
    })

    res.status(200).json({
        status: "success",
        message: "The user has been added",
        data: {user}
    })
})

exports.loginUser = catchAsync(async(req,res,next)=>{

    const {email,password} = req.body;
    
    //check if email and password is correct
    if(!email || !password){
        return next(new AppError("Please enter the user name and password", 400))
    }

    //find user in database
    const user = await User.findOne({email}).select('+password');
    if(!user){
        return next(new AppError("The user does not exist!", 401));
    }

    //check if password is correct or not

    const isPasswordCorrect = await user.comparePassword(password);
    if(!isPasswordCorrect){
        return next(new AppError("The password is not correct!", 401));
    }

    //Assign token to user
    sendToken(user,200,res);


})

exports.logout = catchAsync(async(req,res,next)=>{
    res.cookie('token',null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        status: 'success',
        message: "You have succesfully logged out"
    })
})

exports.forgetPassword = catchAsync(async(req,res,next)=>{
    //Find the email of the user in the database
    const user = await User.findOne({email: req.body.email})

    if(!user){
        return next(new AppError("We did not find an email matching the one provided", 404))
    }

    //Get reset token
    const resetToken = user.generatePasswordResetToken();

    await user.save({validateBeforeSave: false});

    //Create reset url 
    const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
    const message = `Your password reset token is as follows:\n\n${resetUrl}`;

    try {
        
        await sendEmail({
            email: user.email,
            subject: 'Shop It Password Recovery',
            message
        })

        res.status(200).json({
            status: 'success',
            message: `Email sent to ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save({validateBeforeSave: false});

        return next(new AppError(error.message,500))

    }

})

exports.resetPassword = catchAsync(async(req,res,next)=>{

    //Hash Url reset token
    const resetPasswordToken = crypto.createHash('sha256')
    .update(req.params.token).digest('hex');

    //Compare to token in database
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpires:({$gt: Date.now()})
    })

    if(!user){
       return next(new AppError("The password token reset is invalid or expired", 400))
    }

    if(req.body.password !== req.body.conpassword){
            return next(new AppError("Passwords do not match, please re-enter", 400))
    }

    //Create new password
    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    sendToken(user,200,res);

})

//Get current logged in user details
exports.getUserProfile = catchAsync(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        status:'success',
        data:{
            user
        }
    })
})

//Update currently logged in user password
exports.updatePassword = catchAsync(async (req,res,next)=>{
    const user = await User.findById(req.user.id).select('+password');
    //Check user password
    const isMatched = user.comparePassword(req.body.oldpassword);

    //Check to see if it matches the password in the database
    if(!isMatched){
        return next(new AppError('The password you provided does not match our records',400))
    }

    user.password = req.body.password
    await user.save();

    sendToken(user,200,res);



})

//Update information of the currently logged in user

exports.updateMe = catchAsync(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await User.findByIdAndUpdate(req.user.id,newUserData,
        {
            new: true,
            runValidators: true,
        })

    res.status(200).json({
        status: "success",
        message: "Your information was updated successfully"
    })
})

//Admin route - get all users
exports.getAllUsers= catchAsync(async(req,res,next)=>{

    const getAllUsers = await User.find();

    if(!getAllUsers){
        return next(new AppError("Unable to find a user",401));
    }

    res.status(201).json({
        status: "success",
        user: getAllUsers.length,
        data:{
            getAllUsers
        }
    })
})

//Admin route - get single user details

exports.getUserDetails = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new AppError("We could not find a user by that id",400));
    }

    res.status(200).json({
        status: 'success',
        data:{
            user
        }
    })
})


//Admin route - update user's name, password and role
exports.updateUser = catchAsync(async(req,res,next)=>{

    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id,newUserData,
        {
            new: true,
            runValidators: true,
        })

    res.status(200).json({
        status: "success",
        message: "Your information was updated successfully"
    })
})

//Admin route - delete user
exports.deleteuser = catchAsync(async(req,res,next)=>{
    const user = await User.findById(req.params.id);

    if(!user){
        return next(new AppError("We could not find a user by that id",400));
    }

    await user.remove()
    
    res.status(200).json({
        status: 'success',
        message: `The user ${user.name} was removed`
    })
})

