const express = require('express');
const app = express();
const morgan = require('morgan')

const tourRouter = require('./routes/tourRoutes')
const userRouter = require('./routes/userRoutes')

//1.Middlewares

// if(process.env.NODE_ENV === 'development'){
//     app.use(morgan('dev'));
// }

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

//2.routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*',(req, res, next) => {
    res.status(404).json({
        staus:'fail',
        message:`Can't find  ${req.originalUrl} on this Server!`
    })
})

module.exports = app;

