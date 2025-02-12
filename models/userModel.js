const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
//name,email,photo,password,passwordconfirm

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "User must have a name"],
    },
    email: {
        type: String,
        required: [true, "User must have a email"],
        unique: true,
        lowercase: true,
        validate: [validator.isEmail, "Please enter a valid email address"]
    },
    photo: String,
    password: {
        type: String,
        required: [true, "User must have a password"],
        minLength: 8,
        select: false
    },
    role:{
        type:String,
        enum:['user','admin','guide','lead-guide'],
        default:'user'
    },
    changedPasswordAt:Date,
    confirmPassword: {
        type: String,
        required: [true, "User must have a password"],
        validate: {
            validator: function (el) {
                return this.password === el;
            }
        }
    }
});

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined;
})

userSchema.methods.isCorrectPassword = async function (candidatePassword, userPassword) {
    return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter =  function(JWTTimestamp){
    const changedPasswordAtTimeStamp = parseInt(this.changedPasswordAt.getTime())/1000;
    if(this.changedPasswordAfter){
        console.log(`The time changed password:${changedPasswordAtTimeStamp}, iat:${ JWTTimestamp}`) 
        return JWTTimestamp >= changedPasswordAtTimeStamp
    }
    return false
}

const User = mongoose.model("User", userSchema);

module.exports = User;