const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const { createRestaurantController, getAllRestaurantController } = require('../controllers/restaurantController');

const router = express.Router();

//routes
// create restaurant
router.post('/create', authMiddleware, createRestaurantController);

//get all rsetaurant
router.get('/getAll', getAllRestaurantController)

module.exports = router;