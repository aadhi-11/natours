const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopTours,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const {
  protect,
  restrictTo

}=authController


const router = express.Router();
// router.param('id',checKID)

//create a check boc=dy middleware
//check if body contains the name and price property
//If not, send back 400 (Bad request)
//Add it to the post handler stack
router
  .route('/tour-stats')
  .get(getTourStats)

router
.route('/monthly-plan/:year')
.get(getMonthlyPlan)

router
  .route('/top-5-cheap')
  .get(aliasTopTours,getAllTours)

router
  .route('/')
  .get(protect,restrictTo('admin','lead-guide'),getAllTours)
  .post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

module.exports = router;
