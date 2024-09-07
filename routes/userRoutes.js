const express = require('express');
const { getUserController, updateUserController } = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');


const router = express.Router();

//routes
// Get user || GET
router.get('/getUser', authMiddleware, getUserController);

//update profile
router.put('/updateUser', authMiddleware, updateUserController)
module.exports = router