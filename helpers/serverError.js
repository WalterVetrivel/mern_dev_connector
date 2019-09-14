module.exports = (err, res) => {
	console.error(err.message);
	return res.status(500).json({msg: 'Internal server error'});
};
