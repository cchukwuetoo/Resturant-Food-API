const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");

//register
const registerController = async (req, res) => {
    try {
        const {userName, email, password, phone, address, answer} = req.body
        //validation
        if (!userName || !email || !password || !address || !phone || !answer) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide All Fields'
            });
        }
        //check user
        const existing = await userModel.findOne({email})
        if (existing) {
            return res.status(500).send({
                success: false,
                message: 'Email Already Registed Please Login'
            })
        }
        //create new user
        const user = await userModel.create({userName, email, password, address, phone, answer})
        res.status(201).send({
            succes: true,
            message: 'Successfully Registered',
        })


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In Register API',
            error,
        })
    }
};

//login
const loginController = async (req, res) => {
    try {
        const {email, password} = req.body
        //validation
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Login Details'
            })
        }
        //check user
        const user = await userModel.findOne({email})
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            })
        }
        //token
        const token = JWT.sign({id: user._id}, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });
        user.password = undefined;
        res.status(201).send({
            succes: true,
            message: 'Login Successful',
            token,
            user,
        })    

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In Login API',
            error,
        })
    }
}

module.exports = { registerController, loginController };