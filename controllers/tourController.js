const Tour = require('../models/tourModel');
const APIFeatures = require('../utils/apiFeatures')

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
  next();
};



exports.getAllTours = async (req, res) => {
  try {
    
    //EXECUTE QUERY
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
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTour = async (req, res) => {
  console.log(req.params.id);

  try {
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'Success',
      message: 'Done',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'Failed',
      message: err,
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err,
    });
  }
};

exports.getTourStats = async(req, res) => {
  try {
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

  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
}

exports.getMonthlyPlan = async ( req, res) => {
  try{
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
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
}
