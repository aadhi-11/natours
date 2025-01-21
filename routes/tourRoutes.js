const express = require('express');
const tourController = require('./../controllers/tourController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  checKID,
  checkBody
} = tourController;


const router = express.Router();
// router.param('id',checKID)

//create a check boc=dy middleware
//check if body contains the name and price property
//If not, send back 400 (Bad request)
//Add it to the post handler stack


router
  .route('/')
  .get(getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
