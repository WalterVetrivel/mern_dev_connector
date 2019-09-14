const express = require('express');
const {check, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../../models/User');

const auth = require('../../middleware/auth');

const router = express.Router();

// @route  GET api/auth
// @desc   Test route
// @access Public
router.get('/', auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({msg: 'Internal server error'});
	}
});

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
			.isEmpty()
	],
	async (req, res) => {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json({errors: errors.array()});
		}
		try {
			const {email, password} = req.body;

			// Check if user exists
			const user = await User.findOne({email});
			if (!user) {
				return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
			}

			// Verify password
			const isMatch = await bcrypt.compare(password, user.password);
			if (!isMatch) {
				return res.status(400).json({errors: [{msg: 'Invalid credentials'}]});
			}

			// Return JWT
			const payload = {
				user: {
					id: user.id
				}
			};

			jwt.sign(
				payload,
				config.get('jwtSecret'),
				{expiresIn: 3600},
				(err, token) => {
					if (err) throw err;
					return res.status(200).json({
						token
					});
				}
			);
		} catch (err) {
			console.error(err.message);
			return res.status(500).json({message: 'Something went wrong'});
		}
	}
);

module.exports = router;
