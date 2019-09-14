const express = require('express');
const {check} = require('express-validator');

const auth = require('../../middleware/auth');

// Import controllers
const {
	currentProfile,
	createOrUpdateProfile,
	getAllProfiles
} = require('../../controllers/profileController');

const router = express.Router();

// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private
router.get('/me', auth, currentProfile);

// @route  POST api/profile
// @desc   Create or update profile for current user
// @access Private
router.post(
	'/',
	[
		auth,
		check('status', 'Status is required')
			.not()
			.isEmpty(),
		check('skills', 'Skills required')
			.not()
			.isEmpty()
	],
	createOrUpdateProfile
);

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get('/', getAllProfiles);

module.exports = router;
