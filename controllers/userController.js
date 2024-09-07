const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs')

// get user info
const getUserController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({_id:req.body.id})
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            })
        }
        // update
        const { userName, address, phone } = req.body;
        if (!userName) user.userName = userName
        if(!address) user.address = address
        if(!phone) user.phone = phone
        //save user
        await user.save()
        res.status(200).send({
            success: true,
            message: 'User Updated Successfully'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess: false,
            message: 'Error in Get User API',
            error,
        })
    }
};

//update user
const updateUserController = async (req, res) => {
    try {
        //fid user
        const user = await userModel.findById({_id: req.body.id})
        //validation
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'Error In Update User API'
            })
        }
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In Update User API',
            error,
        })
    }
}

module.exports = { getUserController, updateUserController };