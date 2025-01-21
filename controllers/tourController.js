const Tour = require('../models/tourModel')

// const tours = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`)
// );

// exports.checKID = (req, res, next, val) => {
//   console.log(`Tour id is : ${val}`);
//   if (req.params.id * 1 > tours.length) {
//     return res.status(404).json({
//       status: 'fail',
//       message: 'Invalid id',
//     });
//   }
//   next()
// }

// exports.checkBody = (req,res,next) => {
//   const {name,price} = req.body;
//   if(!price || !name){
//     return res.status(400).json({
//       status:'bad request',
//       message:'Missing name or price'
//     })
//   }
//   next()
// }

exports.getAllTours = async (req, res) => {
  try{
  const tours = await Tour.find()
  res.status(200).json({
    status: 'Success',
    results: tours.length,
    data: {
      tours
    },
  })
}catch(err){
  res.status(404).json({
    status:'fail',
    message:err
  })
}
};

exports.getTour = async (req, res) => {
  console.log(req.params.id);
  
  try{
    const tour =await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour
      },
    })
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }


  
};

exports.updateTour =async (req, res) => {

  try{
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators:true
    })
    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    })
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
  


};

exports.createTour = async (req, res) => {

  try{
  const newTour = await Tour.create(req.body)

  res.status(201).json({
    status: 'Success',
    message: 'Done',
    data: {
      tour: newTour,
    },
  })
}catch(err){
  res.status(400).json({
    status:'Failed',
    message:'Invalid data sent !'
  })
}
};

exports.deleteTour = async (req, res) => {
  
  try{
    await Tour.findByIdAndDelete(req.params.id)
    res.status(204).json({
      status: 'Success',
      data: null,
    });
  }catch(err){
    res.status(404).json({
      status:'fail',
      message:err
    })
  }
  
};