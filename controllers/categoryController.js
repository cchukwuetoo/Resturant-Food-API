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
            });
        }
        const newCategory = new categoryModel({title, imageUrl})
        await newCategory.save()
        res.status(201).send({
            success: true,
            message: "Category Created",
            newCategory
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Creating Category API",
            error
        });
    }
};


//get all category
const getAllCatController = async (req, res) => {
    try {
        const categories = await categoryModel.find({})
        if (!categories) {
            return res.status(404),send({
                success: false,
                message: "No Category Found"
            });
        }
        res.status(200).send({
            success: true,
            totalCat: categories.length,
            categories,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error Getting All Category",
            error
        })
    }
};

//update category
const updateCatController = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, imageUrl } = req.body;
        const updatedCategory = await categoryModel.findByIdAndUpdate(
            id,
            { title, imageUrl },
            { new: true }
        );
        if (!updatedCategory) {
            return re.status(500).send({
                success: false,
                message: "No Category Found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Category Updated Successfully"
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error Updating Category",
            error
        });
    }
};

//delete category
const deleteCatController = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(500).send({
                success: false,
                message: "Please Provide Catergory ID"
            })
        }
        const category = await categoryModel.findById(id)
        if (!category) {
            return res.status(500).send({
                success: false,
                message: "No Category Found With this ID"
            });
        }
        await categoryModel.findByIdAndDelete(id);
        res.status(200).send({
            success: true,
            message: "Category Deleted Sucessfully"
        });
    } catch (error) {
       console.log(error)
       res.status(500).send({
        success: false,
        message: "Error Deleting Category",
        error
       }); 
    }
}

module.exports = { createCatController, getAllCatController, updateCatController, deleteCatController };