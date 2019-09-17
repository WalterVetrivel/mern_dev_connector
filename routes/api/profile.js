const express = require('express');
const {check} = require('express-validator');

// MIDDLEWARE
// Auth and validation middleware
const auth = require('../../middleware/auth');
const validation = require('../../middleware/validation');

// Profile objects middleware
const {
	generateProfileObject,
	generateExperienceObject,
	generateEducationObject
} = require('../../middleware/profile/profile');

// CONTROLLERS
const {
	currentProfile,
	createOrUpdateProfile,
	getAllProfiles,
	getProfileById,
	deleteProfileUserAndPosts,
	putExperience,
	deleteExperience,
	putEducation,
	deleteEducation,
	getGithubRepos
} = require('../../controllers/profileController');

const router = express.Router();

// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private
router.get('/me', auth, currentProfile);

// @route  POST api/profile
// @desc   Create or update profile for current user
// @access Private
// @todo Create separate routes for creation and updation
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
		validation,
		generateProfileObject
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
			.isEmpty(),
		validation,
		generateExperienceObject
	],
	putExperience
);

// @route  DELETE api/profile/experience/:exp_id
// @desc   Remove experience
// @access Private
router.delete('/experience/:exp_id', auth, deleteExperience);

// @route  PUT api/profile/education
// @desc   Add education
// @access Private
router.put(
	'/education',
	[
		auth,
		check('school', 'School is required')
			.not()
			.isEmpty(),
		check('degree', 'Degree is required')
			.not()
			.isEmpty(),
		check('fieldOfStudy', 'Field of study is required')
			.not()
			.isEmpty(),
		check('from', 'From date is required')
			.not()
			.isEmpty(),
		validation,
		generateEducationObject
	],
	putEducation
);

// @route  DELETE api/profile/education/:edu_id
// @desc   Remove education
// @access Private
router.delete('/education/:edu_id', auth, deleteEducation);

// @route  GET api/profile/github/:username
// @desc   Get user repos from GitHub
// @access Public
router.get('/github/:username', getGithubRepos);

module.exports = router;
