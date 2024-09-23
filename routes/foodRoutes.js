const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { createFoodController, getAllFoodController, getFoodByIdController, getFoodByRestaurantIdController, updateFoodController, deleteFoodController, placeOrderController, orderStatusController } = require("../controllers/foodController");
const adminMiddleware = require("../middlewares/authMiddleware");


const router = express.Router();

//router
//create food
router.post('/create', authMiddleware, createFoodController);

//Get all food
router.get('/getAll', getAllFoodController);

//Get food by id
router.get('/get/:id', getFoodByIdController);

//Get food by restaurant id
router.get('/getByRestaurant/:id', getFoodByRestaurantIdController);

//update food 
router.put('/update/:id', authMiddleware, updateFoodController);

//delete food 
router.delete('/delete/:id', authMiddleware, deleteFoodController);

//Place order
router.post('/placeOrder', authMiddleware, placeOrderController);

//order status
router.post('/orderStatus/:id',adminMiddleware, authMiddleware, orderStatusController);

module.exports = router;