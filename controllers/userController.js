const {validationResult} = require('express-validator');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');

const signJwt = require('../helpers/signJwt');
const serverError = require('../helpers/serverError');

const User = require('../models/User');

const hashPassword = async password => {
	const salt = await bcrypt.genSalt(10);
	return bcrypt.hash(password, salt);
};

const getAvatar = email =>
	gravatar.url(email, {
		s: '200',
		r: 'pg',
		d: 'mm'
	});

const createUser = async (name, email, avatar, password) => {
	const user = new User({name, email, avatar, password});
	return user.save();
};

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
		const avatar = getAvatar(email);

		// Hash password
		const hashedPassword = await hashPassword(password);

		// Save user
		const newUser = await createUser(name, email, avatar, hashedPassword);

		// Return JWT
		signJwt(newUser, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token
			});
		});
	} catch (err) {
		return serverError(err, res);
	}
};
