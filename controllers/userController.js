const userModel = require("../models/userModel");
const bcrypt = require('bcryptjs')

// get user info
const getUserController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({ _id: req.body.id });
        //validation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'User Not Found'
            })
        }
        //hide password
        user.password = undefined;
        //resp
        res.status(200).send({
            success: true,
            message: 'User get Sucessful',
            user,
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            sucess: false,
            message: 'Error in Get User API',
            error,
        });
    }
};

//update user
const updateUserController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findById({_id: req.body.id})
        //validation
        if(!user){
            return res.status(404).send({
                success: false,
                message: 'User not Found'
            });
        }
        // update
        const { userName, address, phone } = req.body;
        if (userName) user.userName = userName;
        if(address) user.address = address;
        if(phone) user.phone = phone;
        //save user
        await user.save()
        res.status(200).send({
            success: true,
            message: 'User Updated Successfully'
        })
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error In Update User API',
            error,
        })
    }
};

//Update password 
const updatePasswordController = async (req, res) => {
    try {
        //find user
        const user = await userModel.findId({ _id: req.body.id })
        //validation
        if (!user) {
            return res.status(404).send({
                sucess: false,
                message: 'User Not Found'
            });
        }
        // get data from user
        const { oldPassword, newPassword } = req.body;
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide Old or New Password',
            });
        }
        //check user password | compare password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: 'Invalid Old Password',
            });
        }
        //hahing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Password Updated',
        });

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Password Update API",
            error,
        });
    }
};

//reset password
const resetPassswordController = async (req, res) => {
    try {
        const {email, newPassword, answer} = req.body;
        if (!email || !newPassword || !answer) {
            return res.status(500).send({
                success: false,
                message: 'Please Provide all Fields'
            })
        }
        const user = await userModel.findOne({email, answer})
        if (!user) {
            return res.status(500).send({
                success: false,
                message: "User Not Found or Invalid Answer"
            })
        }
        //hahing password
        var salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        user.password = hashedPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: 'Password Rest Sucessfully',
        });


    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in Password Reset API',
            error
        })
    }
}

module.exports = { getUserController, updateUserController, updatePasswordController, resetPassswordController };