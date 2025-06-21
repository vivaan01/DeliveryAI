const express = require('express');
const router = express.Router();
const { handleVoiceResponse } = require('../controllers/twilioController');

// @route   POST /api/twilio/voice-response
// @desc    Handle the response from Twilio Gather
// @access  Public
router.post('/voice-response', handleVoiceResponse);

module.exports = router; 