const serverError = require('../helpers/serverError');

const User = require('../models/User');
const Post = require('../models/Post');

// Create new post
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

// Get all posts
exports.getPosts = async (req, res) => {
	try {
		const posts = await Post.find().sort({createdAt: -1});
		return res.json(posts);
	} catch (err) {
		serverError(err, res);
	}
};

// Get post by ID
exports.getPostById = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) return res.status(404).json({msg: 'Not found'});

		return res.json(post);
	} catch (err) {
		if (err.kind === 'ObjectId')
			return res.status(404).json({msg: 'Not found'});

		serverError(err, res);
	}
};

// Delete post
exports.deletePost = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post) return res.status(404).json({msg: 'Not found'});

		// Check if user is the creator of the post
		if (post.user.toString() !== req.user.id)
			return res.status(401).json({msg: 'Unauthorized'});

		await post.remove();
		return res.status(200).json({msg: 'Post removed'});
	} catch (err) {
		if (err.kind === 'ObjectId')
			return res.status(404).json({msg: 'Not found'});

		serverError(err, res);
	}
};
