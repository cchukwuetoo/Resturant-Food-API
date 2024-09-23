const mongoose = require("mongoose");
const foodModel = require("../models/foodModel");
const orderModel = require("../models/orderModel");

//Create food
const createFoodController = async (req, res) => {
    try {
        const {title, description, price, imageUrl, foodTags, category, code, isAvailable, restaurant, rating} = req.body;
        if (!title || !description || !price || !restaurant) {
            return res.status(500).send({
                success: false,
                message: "Please Provide All Required Fields"
            });
        }
        //check if food with the same title exists
        const existingFood = await foodModel.findOne({ title, restaurant });
        if (existingFood) {
            return res.status(409).send({
                success: false,
                message: `Food item with title "${title}" already exists in this restaurant.`,
            });
        }
        const newFood = new foodModel({
            title, description, price, imageUrl, foodTags, category, code, isAvailable, restaurant, rating
        });
        await newFood.save()
        res.status(200).send({
            success: true,
            message: "New Food Item Created Successfully",
            newFood,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error Creating Food",
            error
        })
    }
};

//get all food
const getAllFoodController = async (req, res) => {
    try {
        const foods = await foodModel.find({})
        if (!foods) {
            return res.status(404),send({
                success: false,
                message: "No Food Items Found"
            });
        }
        res.status(200).send({
            success: true,
            totalFoods: foods.length,
            foods,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error getting all food",
            error
        });
    }
};

//get food by id
const getFoodByIdController = async (req, res) => {
    try {
        const foodId = req.params.id;
        if (!foodId) {
            return res.status(404).send({
                success: false,
                message: "Please provide Id"
            });
        }
        const food = await foodModel.findById(foodId)
        if (!food) {
            return res.status(404).send({
                success: false,
                message: "No Food Found with this ID"
            });
        }
        res.status(200).send({
            success: true,
            message: "Food ID Found Successfully",
            food,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error Getting Food By ID",
            error
        });
    }
};

// get food by restaurant id
const getFoodByRestaurantIdController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        if (!restaurantId) {
            return res.status(404).send({
                success: false,
                message: "Please provide Id"
            });
        }
        const food = await foodModel.find({ restaurant: restaurantId });
        if (!food) {
            return res.status(404).send({
                success: false,
                message: "No Food Found with this ID"
            });
        }
        res.status(200).send({
            success: true,
            message: "Food ID Based on Restaurant Found Successfully",
            food,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error Getting Food By Restaurant ID",
            error
        });
    }
};

// update food
const updateFoodController = async (req, res) => {
    try {
        const foodId = req.params.id
        if (!foodId) {
            return res.status(404).send({
                success: false,
                message: "No Food ID Was Found",
            });
        }
        const food = await foodModel.findById(foodId)
        if (!food) {
            return res.status(404).send({
                success: false,
                message: "No Food Found"
            });
        }
        const { title, description, price, imageUrl, foodTags, category, code, IsAvailable, restaurant, rating } = req.body;
        const updatedFood = await foodModel.findByIdAndUpdate(foodId, { title, description, price, imageUrl, foodTags, category, code, IsAvailable, restaurant, rating }, { new: true});
        res.status(200).send({
            success: true,
            message: "Food Item Was Updated",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error Updating Food",
            error
        });
    }
};

//delete controller
const deleteFoodController = async (req, res) => {
    try {
        const foodId = req.params.id;
        if (!foodId) {
            return res.status(404).send({
                success: false,
                message: "Please Provide Food Id or No Food found"
            });
        }
        await foodModel.findByIdAndDelete(foodId)
        res.status(200).send({
            success: true,
            message: "Food Deleted Successfully"
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in deleting Food",
            error 
        });
    }
};

//place order
const placeOrderController = async (req, res) => {
    try {
        const {cart, payment} = req.body;
        if (!cart || cart.length === 0) {
            return res.status(500).send({
                success: false,
                message: "Please Food Cart Or Payment Method",
            });
        }
        let total = 0;
        //cal
        cart.forEach((item) => {
            total += item.price;
        });
        const foodId = cart.map(item => new mongoose.Types.ObjectId(item.id));
        const newOrder = new orderModel({
            foods: foodId,
            payment: total,
            buyer: req.body.id,
        });
        await newOrder.save();
        res.status(201).send({
            success: true,
            message: "order Placed Successfully",
            newOrder,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error Placing Order",
            error
        });
    }
};

//change order status
const orderStatusController = async (req, res) => {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            return res.status(404).send({
                success: false,
                message: "Please Provide Valid Order ID"
            })
        }
        const { status } = req.body;
        const order = await orderModel.findByIdAndUpdate(orderId, {status}, {new: true})
        res.status(200).send({
            success: true,
            message: "Order Status Updated"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error in Status Order",
            error,
        });
    }
};

module.exports = { createFoodController, getAllFoodController, getFoodByIdController, getFoodByRestaurantIdController, updateFoodController, deleteFoodController, placeOrderController, orderStatusController };