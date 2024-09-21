const categoryModel = require("../models/categoryModel");
// create category
const createCatController = async (req, res) => {
    try {
        const {title, imageUrl} = req.body;
        //validation
        if (!title || !imageUrl) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Category Title or Image"
            })
        }
        const newCategory = new categoryModel({title, imageUrl})
        await newCategory.save()
        res.status(201).send({
            success: true,
            message: "Category Created",
            newCategory
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Creating Category API",
            error
        })
    }
}

module.exports = { createCatController };