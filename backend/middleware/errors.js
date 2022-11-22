const AppError = require("../utils/errorHandler");

module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500;

    if(process.env.NODE_ENV === "DEVELOPMENT"){
        res.status(err.statusCode).json({
        success: false,
        error: err.stack,
        errorMessage: err.message,
        stack: err.stack
        })
        
    }

    if(process.env.NODE_ENV === 'PRODUCTION'){
        let error = {...err}
        error.message = err.message
        //Handle Mongoose errors

        if(err.name === 'CastError'){
            const message = `Item not found. Invalid id: ${err.path}`;
            error = new AppError(message,400);
            // console.log(error);
        }

        //Handling Mongoose Validation Errors

        if(err.name === 'ValidationError'){
            const message = Object.values(err.errors).map(value =>value.message);
            error = new AppError(message,400);
        }
        res.status(err.statusCode).json({
        status: "failed",
        message: error.message || "Unknown Error Occured"
        })
    }

    //Handling Duplicate Data in Mongoose
    if(err.code === '11000'){
        const message = `Duplicate Values entered ${Object.keys(err.keyValue)}`;
        error = new AppError(message,400);
    }

      //Handling Token Error
      if(err.code === 'JsonWebTokenError'){
        const message = "Web Token is invalid!";
        error = new AppError(message,400);
    }

      //Handling Token Expired
      if(err.code === 'TokenExpireError'){
        const message = "Web Token has expired!";
        error = new AppError(message,400);
    }
   

    
}