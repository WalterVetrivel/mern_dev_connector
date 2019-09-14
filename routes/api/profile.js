const express = require('express');
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

const {
	currentProfile,
	createOrUpdateProfile
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

module.exports = router;
