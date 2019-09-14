const express = require('express');
const {check} = require('express-validator');

const validation = require('../../middleware/validation');
const auth = require('../../middleware/auth');

// Import controllers
const {
	currentProfile,
	createOrUpdateProfile,
	getAllProfiles,
	getProfileById,
	deleteProfileUserAndPosts,
	putExperience
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
			.isEmpty(),
		validation
	],
	createOrUpdateProfile
);

// @route  GET api/profile
// @desc   Get all profiles
// @access Public
router.get('/', getAllProfiles);

// @route  GET api/profile/user/:id
// @desc   Get profile by user id
// @access Public
router.get('/user/:id', getProfileById);

// @route  DELETE api/profile
// @desc   Delete profile, user and posts
// @access Private
router.delete('/', auth, deleteProfileUserAndPosts);

// @route  PUT api/profile/experience
// @desc   Add experience
// @access Private
router.put(
	'/experience',
	[
		auth,
		check('title', 'Title is required')
			.not()
			.isEmpty(),
		check('company', 'Company is required')
			.not()
			.isEmpty(),
		check('from', 'From date is required')
			.not()
			.isEmpty()
	],
	validation,
	putExperience
);

module.exports = router;
