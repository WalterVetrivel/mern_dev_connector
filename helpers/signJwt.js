const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = (user, callback) => {
	const payload = {
		user: {
			id: user.id
		}
	};

	jwt.sign(payload, config.get('jwtSecret'), {expiresIn: 3600}, callback);
};
