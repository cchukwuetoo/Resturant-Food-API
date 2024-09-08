const express = require('express');
const { getUserController, updateUserController, updatePasswordController, resetPassswordController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

//routes
// Get user || GET
router.get('/getUser', authMiddleware, getUserController);

//update profile
router.put('/updateUser', authMiddleware, updateUserController);

//password update
router.post('/updatePassword', authMiddleware, updatePasswordController );

router.post('/resetPassword', authMiddleware, resetPassswordController)
module.exports = router