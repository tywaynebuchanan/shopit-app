const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const JWT = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = mongoose.Schema({

    email: {
        type: String,
        required: [true, "A user name is required"],
        maxLength:[40, "Your email address  is too long"],
        unique: true,
        validate: [validator.isEmail,"Please enter a valid email address"]
    },

    name: {
        type: String,
        required: [true, "A name is required"],
        unique: true
    },

    password: {
        type: String,
        required:[true,"A password is required"],
        minlength: [6, "The password must be more than 6 characters"],
        select: false


    },
    // conpassword:{
    //     type: String,
    //     required: [true,"You need to confirm your password"]
    // },
    avatar:{
        type: String,
        default:'image'
    },
    role:{
        type: String,
        default: 'user'
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true

    },
    resetPasswordToken: String,
    resetPasswordExpires: Date

},{timestamps: true})

//Encrypt password before saving

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next();
    }

    this.password = await bcrypt.hash(this.password,10)
})

//Return JSON Web Token 

userSchema.methods.getJwtToken = function (){
    return JWT.sign({id:this._id},process.env.SECRET,{
        expiresIn: process.env.EXPIRES_IN
    })
}

//Compare user password 
userSchema.methods.comparePassword = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}

//Generate reset password token
userSchema.methods.generatePasswordResetToken = function(){
    const resetToken = crypto.randomBytes(20).toString('hex');

    //Hash the token 
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpires = Date.now() + 30 * 60 * 1000;
    return resetToken;
}
const User = mongoose.model("users-shop-it",userSchema);
module.exports = User;