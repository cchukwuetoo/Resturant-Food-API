const restaurantModel = require("../models/restaurantModel");
// create restaurant
const createRestaurantController = async (req, res) => {
    try {
        const {title, imageUrl, foods, pickup, delivery, isOpen, logUrl, rating, ratingCount, code, coords} = req.body;
        if (!title || !coords) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Title and Address"
            });
        }
        const newRestaurant = new restaurantModel({title, imageUrl, foods, pickup, delivery, isOpen, logUrl, rating, ratingCount, code, coords});
        await newRestaurant.save()
        res.status(201).send({
            success: true,
            message: "New restaurant Created successfully",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess: false,
            message: "Error In Creating Restaurant API",
            error,
        });
    }
};

// get all restaurants
const getAllRestaurantController = async (req, res) => {
    try {
        const restaurants = await restaurantModel.find({})
        if (!restaurants) {
            return res.status(404).send({
                sucess: false,
                message: "No Restaurant Availiable"
            });
        }
        res.status(200).send({
            success: true,
            totalCount: restaurant.length,
            restaurants
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess: false,
            message: "Error Getting All Restaurants",
            error
        });
    }
};

module.exports = { createRestaurantController, getAllRestaurantController };