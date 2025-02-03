const User = require('../models/userModel');
const catchAsycError = require('../utils/catchAsyncError');
const jwt = require('jsonwebtoken');

exports.signup = catchAsycError(async (req, res, next) => {
    const newUser =await User.create(req.body);
    const token = jwt.sign({id:newUser._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
    res.status(201).json({
        status:'Success',
        message:'User created Successfully',
        token,
        data:{
            user:newUser
        }
    })
});
