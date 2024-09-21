const express = require("express");

const authMiddleware = require("../middlewares/authMiddleware");
const { createCatController } = require("../controllers/categoryController");

const router = express.Router();

//router
//create category
router.post('/create', authMiddleware, createCatController)

module.exports = router;