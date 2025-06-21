const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getDeliveryPartners } = require('../controllers/authController');
const { protect, admin } = require('../middleware/authMiddleware');

// @route   POST api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', registerUser);

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', loginUser);

// @route   GET api/auth/delivery-partners
// @desc    Get all delivery partners
// @access  Private/Admin
router.get('/delivery-partners', protect, admin, getDeliveryPartners);

module.exports = router;
