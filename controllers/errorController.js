const AppError = require('../utils/appError');

const handleCastErrDb = err => {
    const message = `Invalid ${err.path} : ${err.value}`;
    return new AppError(message,400)
}

const handleDuplicateErrDB = err => { 
   const message = `Duplicate field name ${JSON.stringify(err.keyValue)}. Please use another value .`;
   return new AppError(message,400)
}

const handleValidationErrDB = err => {
    const msg = Object.values(err.errors).map(el => el.message)
    const message = `Validation failed ${msg.join('. ')}.`
    return new AppError(message,400)
}

const handleJsonWebTokenErr = err => new AppError('Invalid token please login again',401);
const handleTokenExpiredError = err => new AppError('Token expired please login again',401)

const sendErrDev = (err,res) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message || err.msg,
        error: err,
        stack : err.stack,
        env:'development'
    })
}

const sendErrProd = (err,res) => {
    if(err.isOperational){
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message
        })
    }else{
        res.status(500).json({
            status:'error',
            error: ' Something went very wrong'
        })
    }

}

module.exports = (err, req, res, next)=>{
    err.statusCode = err.statusCode || 500 ;
    err.status = err.status || 'error' ;

    if(process.env.NODE_ENV === 'development'){

        let error = {...err};

        // if(err.name === 'CastError') {
        //     error = handleCastErrDb(error)
        // }
        // if(err.code === 11000){  
        //    error = handleDuplicateErrDB(error)
        // }
        // if(err.name === 'ValidationError') error=handleValidationErrDB(error)
        sendErrDev(error,res)

    }else if(process.env.NODE_ENV === 'production'){
        let error = {...err};

        if(err.name === 'CastError') error = handleCastErrDb(error);
        if(err.code === 11000) error = handleDuplicateErrDB(error);
        if(err.name === 'ValidationError') error=handleValidationErrDB(error);
        if(err.name === 'jsonWebTokenError') error = handleJsonWebTokenErr(error)
        if(err.name === 'TokenExpiredError') error = handleTokenExpiredError(error)
        sendErrProd(error,res)
    }

}