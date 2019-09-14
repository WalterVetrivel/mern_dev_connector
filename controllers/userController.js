const {validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

const User = require('../models/User');

exports.registerUser = async (req, res) => {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.status(400).json({errors: errors.array()});
	}
	try {
		const {name, email, password} = req.body;
		// Check if user exists
		const existingUser = await User.findOne({email});
		if (existingUser) {
			return res.status(400).json({errors: [{msg: 'Email already in use'}]});
		}

		// Get user's gravatar
		const avatar = gravatar.url(email, {
			s: '200',
			r: 'pg',
			d: 'mm'
		});

		// Hash password
		const salt = await bcrypt.genSalt(10);
		const hashedPassword = await bcrypt.hash(password, salt);

		// Save user
		const user = new User({name, email, avatar, password: hashedPassword});
		const newUser = await user.save();

		// Return JWT
		const payload = {
			user: {
				id: newUser.id
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
};
