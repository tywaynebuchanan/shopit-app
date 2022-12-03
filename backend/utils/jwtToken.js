//Create and send and save token in cookie

const sendToken = (user,statusCode,res) =>{

    //Create JWT token
    const token = user.getJwtToken();

    //Options for cookies
    const options = {
        expires: new Date (
            Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
        ),
        httpOnly: true
    }

    res.status(statusCode).cookie('token',token,options).json({
        success: true,
        message:"You are now logged in",
        token,
        user

    })

}

module.exports = sendToken;