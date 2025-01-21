const mongose = require('mongoose');

const tourSchema = new mongose.Schema({
    name:{
      type:String,
      required:[true,'A tour must have a name'],
      unique:true,
      trim:true
    },
    duration:{
      type:Number,
      required:[true,'A tour must have a duration']
    },maxGroupSize:{
      type:Number,
      required:[true,'A tour must have a group size']
    },
    difficulty:{
      type:String,
      required:[true,'A tour must have a difficulty']
    },
    ratingsAverage:{
      type:Number,
      default:4.5
    },
    ratingsQuantity:{
      type:Number,
      default:0
    },
    price:{
      
        type:Number,
        required:[true,'A tour must have a name']
      
    },
    priceDiscount:Number,
    Summary:{
      type:String,
      trim:true
    }
  })
  
  const Tour = mongose.model('Tour',tourSchema);

  module.exports = Tour;