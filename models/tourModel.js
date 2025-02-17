const mongose = require('mongoose');
const slugify = require('slugify')

const tourSchema = new mongose.Schema({
    name:{
      type:String,
      required:[true,'A tour must have a name'],
      unique:true,
      minLength:[10,'Length of Name must be larger than or equal to 10 '],
      maxLength:[15,'Length of Name must be lesser than or equal to 15 '],
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
      required:[true,'A tour must have a difficulty'],
      enum:{
        values:['easy','medium','difficult'],
        message:"Difficulty must be either : easy, medium or difficult"
      }
    },
    ratingsAverage:{
      type:Number,
      default:4.5,
      min:[1,'Ratings should be greater than or equal to 1.0'],
      max:[5,'Ratings should be lesser than or equal to 5.0']
    },
    slug:String,
    ratingsQuantity:{
      type:Number,
      default:0
    },
    price:{
        type:Number,
        required:[true,'A tour must have a name']  
    },
    priceDiscount:{
      type:Number,
      validate : {
        validator : function(val){
          return val < this.price ;
        },
        message:`The discounted price ({VALUE}) must be lesser than the regular price `
      }
    },
    summary:{
      type:String,
      trim:true,
      required:[true,'A tour must have a description']
    },
    description:{
      type:String,
      trim:true
    },
    imageCover:{
      type:String,
      required: [true,'A tour must have a cover image']
    },
    images:[String],
    createdAt:{
      type:Date,
      default: Date.now(),
      select:false
    },
    secretTour:{
      type:Boolean,
      default:false
    },
    startDates: [Date]
  },{
    toJSON: { virtuals : true},
    toObject: { virtuals : true}
  })

  tourSchema.virtual('durationWeeks').get(function(){
    return this.duration / 7;
  })
  
  //1.DOCUMENT MIDDLEWARE

  // tourSchema.pre('save',function(next){
  //   console.log(this);
  //   next()
  // })

  tourSchema.pre('save',function(next){
    this.slug = slugify(this.name,{lower:true});
    next()
  })

  // tourSchema.post('save',function(doc, next){
  //   console.log(doc);
  //   next()
  // })

  //2.QUERY MIDDLEWARE

  tourSchema.pre(/^find/,function(next){
    this.find( {secretTour : { $ne : true} });
    this.start = Date.now();
    next();
  })

  tourSchema.post(/^find/,function(doc,next){
    console.log(`The time taken is ${Date.now() - this.start} ms`);
    next()
  })

  //3.AGGREGATE MIDDLEWARE

  tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match : {secretTour : { $ne : true} }})
    next()
  })


  const Tour = mongose.model('Tour',tourSchema);

  module.exports = Tour;