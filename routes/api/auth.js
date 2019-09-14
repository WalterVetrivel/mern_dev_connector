const express = require('express');
const {check} = require('express-validator');

const auth = require('../../middleware/auth');
const validation = require('../../middleware/validation');

const {authTest, login} = require('../../controllers/authController');

const router = express.Router();

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get('/', auth, authTest);

// @route  POST api/auth
// @desc   Authenticate user and get token
// @access Public
router.post(
	'/',
	[
		check('email', 'Email is required')
			.not()
			.isEmpty(),
		check('password', 'Password is required')
			.not()
			.isEmpty(),
		validation
	],
	login
);

module.exports = router;
