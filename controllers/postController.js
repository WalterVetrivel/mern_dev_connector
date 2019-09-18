const serverError = require('../helpers/serverError');

const User = require('../models/User');
const Profile = require('../models/Profile');
const Post = require('../models/Post');

exports.createPost = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');

		const newPost = new Post({
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		});

		const post = await newPost.save();

		return res.json(post);
	} catch (err) {
		serverError(err, res);
	}
};

exports.getPosts = async (req, res) => {
	try {
		const posts = await Post.find().sort({createdAt: -1});
		return res.json(posts);
	} catch (err) {
		serverError(err, res);
	}
};

exports.getPostById = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		return res.json(post);
	} catch (err) {
		serverError(err, res);
	}
};
