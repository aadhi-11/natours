const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures')
const catchAsycError = require('../utils/catchAsyncError');
const AppError = require('../utils/appError')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};




exports.getAllTours = catchAsycError(async (req, res, next) => {
    const features = new APIFeatures(Tour.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const tours = await features.query;

    //SEND RESPONSE

    res.status(200).json({
      status: 'Success',
      results: tours.length,
      data: {
        tours,
      },
    });
});

exports.getTour =catchAsycError( async (req, res, next) => {

    const tour = await Tour.findById(req.params.id);

    if(!tour){
      return next( new AppError('No tour is available with this Id',404))
    }

    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });

});

exports.updateTour =catchAsycError( async (req, res, next) => {

    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if(!tour){
      return next( new AppError('No tour is available with this Id',404))
    }

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });

});

exports.createTour = catchAsycError(async (req, res, next) => {

    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      message: 'Done',
      data: {
        tour: newTour,
      },
    });
});

exports.deleteTour = catchAsycError(async (req, res, next) => {

    const tour = await Tour.findByIdAndDelete(req.params.id);
    if(!tour){
      return next( new AppError('No tour is available with this Id',404))
    }
    res.status(204).json({
      status: 'Success',
      data: null,
    });

});

exports.getTourStats = catchAsycError(async(req, res, next) => {

    const stats = await Tour.aggregate([
      {
        $match: { ratingsAverage: { $gte: 2 } }
      },
      {
        $group: {
          _id: {$toUpper: '$difficulty'}, 
          sumTOurs : {$sum : 1},
          numRatings:{$sum : '$ratingsQuantity'},
          avgRating: { $avg: '$ratingsAverage' },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      },{
        $sort : { avgPrice : 1 }
      },
      // {
      //   $match : {_id : { $ne : 'EASY'}}
      // }
    ]);

    res.status(200).json({
      status: 'Success',
      results: stats.length,
      data: {
        stats
      }
    });
})

exports.getMonthlyPlan = catchAsycError(async ( req, res, next) => {
    const year = req.params.year * 1;
    const plan = await Tour.aggregate([
      {
        $unwind : '$startDates'
      },
      {
        $match:{
          startDates : {
             $gte : new Date(`${year}-01-01`),
             $lte : new Date(`${year}-12-31`),
            }
        }
      },{
        $group : {
          _id : { $month : '$startDates'},
          TourCount : { $sum : 1},
          tours : {
            $push : '$name'
          }
        }
      },
      {
        $addFields : {month : '$_id'}
      },
      {
        $project : { _id : 0}
      },
      {
        $sort : {
          TourCount : -1
        }
      },
      {
        $limit:12
      }
    ]);

    res.status(200).json({
      status:'success',
      count : plan.length,
      data:{
        plan
      }
    })

})
