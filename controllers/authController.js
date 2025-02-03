const User = require('../models/userModel');
const catchAsycError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');

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
    console.log(token)
    if(!token){
        return next(new AppError('You are not logged in, please login to get access',401))
    }

    //2.validate token
    next()
});