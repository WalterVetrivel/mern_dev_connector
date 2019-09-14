const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');

const signJwt = require('../helpers/signJwt');
const serverError = require('../helpers/serverError');

const User = require('../models/User');

exports.authTest = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		res.json(user);
	} catch (err) {
		return serverError(err, res);
	}
};

exports.login = async (req, res) => {
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
		signJwt(user, (err, token) => {
			if (err) throw err;
			return res.status(200).json({
				token
			});
		});
	} catch (err) {
		return serverError(err, res);
	}
};
