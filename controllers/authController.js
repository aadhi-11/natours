const User = require('../models/userModel');
const catchAsycError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const {promisify} = require('util');
const { json } = require('stream/consumers');

const signToken = id =>{
    return jwt.sign({id:id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}

exports.signup = catchAsycError(async (req, res, next) => {
    const newUser =await User.create(req.body);
    const token = signToken(newUser._id);
    res.status(201).json({
        status:'Success',
        message:'User created Successfully',
        token,
        data:{
            user:newUser
        }
    })
});

exports.login = catchAsycError(async (req, res, next) => {
    console.log(req.body)
    const { email, password} = req.body;

    if(!email, !password) {
        return next(new AppError('Enter email and password !',400));
    };

    const user = await User.findOne({ email }).select('+password')
    if(!user || !(await user.isCorrectPassword(password, user.password))){
        return next(new AppError('Invalid email or password',401));
    }
    const token = signToken(user._id);

    res.status(200).json({
        status:'Success',
        token
    })
})

exports.protect = catchAsycError(async (req, res, next) => {
    //1.check is there tocken
    let token=''
    if(req.headers.authentication && req.headers.authentication.startsWith('Bearer')){
        token = req.headers.authentication.split(' ')[1];
    }
 
    if(!token){
        return next(new AppError('You are not logged in, please login to get access',401))
    }

    //2.validate token
    console.log(token)
    console.log(process.env.JWT_SECRET)
    // const decoded = promisify(jwt.verify)(token,process.env.JWT_SECRET)
    jwt.verify(token,process.env.JWT_SECRET,  (err,decode)=>{
        if(err){
            return next(new AppError(err.message,401))
        }
        User.findOne({_id:decode.id},(err,newUser)=>{
            if(err){
                return next(new AppError("Token not belongs to a valid user, login again",401))
            }
            console.log(newUser.changedPasswordAfter(decode.iat))
            if(newUser.changedPasswordAfter(decode.iat)){
                
                return next(new AppError("Password has changed login again",401))
            }
            next()
        })
    })

    //3.check user still exists
    
    // const currentUser = await User.findOne(decoded.id)
    // console.log(currentUser)

    // if(!currentUser){
    //     return next(new AppError("Token not belongs to a valid user, login again"));
    // }

    // //4.check user has changed password
    // console.log(decoded)
    // console.log(`The decoded object : ${decoded.id}`)
    // currentUser.changedPasswordAfter(decoded.iat)

});