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
            totalCount: restaurants.length,
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

// get all restaurants by id
const getRestaurantByIdController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        if (!restaurantId) {
            return res.status(404).send({
                success: false,
                message: "Please Provide Restaurant ID",
            });
        }
        // find resturant
        const restaurant = await restaurantModel.findById(restaurantId)
        if(!restaurant){
            return res.status(404).send({
                success: false,
                message: 'No restaurant found!'
            })
        }
        res.status(200).send({
            succes: true,
            restaurant,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error Getting Restaurant by Id",
            error
        });
    }
};

const deleteRestaurantController = async (req, res) => {
    try {
        const restaurantId = req.params.id;
        if (!restaurantId) {
            return res.status(404).send({
                success: false,
                message: "Please Provide Restaurant Id or No resturant found"
            })
        }
        await restaurantModel.findByIdAndDelete(restaurantId)
        res.status(200).send({
            success: true,
            message: "Restaurant Deleted Successfully"
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error deleting Restaurant",
            error
        })
    }
}

module.exports = { createRestaurantController, getAllRestaurantController, getRestaurantByIdController, deleteRestaurantController };