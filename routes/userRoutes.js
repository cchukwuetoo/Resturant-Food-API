const express = require('express');
const { getUserController, updateUserController, updatePasswordController, resetPassswordController, deleteProfileController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

//routes
// Get user || GET
router.get('/getUser', authMiddleware, getUserController);

//update profile
router.put('/updateUser', authMiddleware, updateUserController);

//password update
router.post('/updatePassword', authMiddleware, updatePasswordController );

//reset password
router.post('/resetPassword', authMiddleware, resetPassswordController)

//delete user
router.delete('/deleteUser/:id', authMiddleware, deleteProfileController)
module.exports = router