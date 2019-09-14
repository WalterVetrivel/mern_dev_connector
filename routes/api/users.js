const express = require('express');
const {check} = require('express-validator');

const validation = require('../../middleware/validation');

const {registerUser} = require('../../controllers/userController');

const router = express.Router();

// @route  POST api/users
// @desc   Register user
// @access Public
router.post(
	'/',
	[
		check('name', 'Name is required')
			.not()
			.isEmpty(),
		check('email', 'Please enter a valid email').isEmail(),
		check('email', 'Email is required')
			.not()
			.isEmpty(),
		check('password', 'Password is required')
			.not()
			.isEmpty(),
		check('password', 'Password too short').isLength({min: 8}),
		validation
	],
	registerUser
);

module.exports = router;
