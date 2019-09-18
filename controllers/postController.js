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

// Like post
exports.likePost = async (req, res) => {
	try {
		post = await Post.findById(req.params.id);

		if (!post) return res.status(404).json({msg: 'Not found'});

		if (post.likes.find(like => like.user.toString() === req.user.id))
			return res.json({msg: 'Already liked'});

		post.likes.unshift({user: req.user.id});

		await post.save();
		return res.json(post.likes);
	} catch (err) {
		if (err.kind === 'ObjectId')
			return res.status(404).json({msg: 'Not found'});
		serverError(err, res);
	}
};

// Unlike post
exports.unlikePost = async (req, res) => {
	try {
		post = await Post.findById(req.params.id);

		if (!post) return res.status(404).json({msg: 'Not found'});

		// Get remove index
		const removeIndex = post.likes.findIndex(
			like => like.user.toString() === req.user.id
		);

		if (removeIndex < 0) return res.status(404).json({msg: 'Not liked yet'});
		post.likes.splice(removeIndex, 1);

		await post.save();
		return res.json({msg: 'Post unliked'});
	} catch (err) {
		if (err.kind === 'ObjectId')
			return res.status(404).json({msg: 'Not found'});
		serverError(err, res);
	}
};

// Add comment
exports.createComment = async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select('-password');
		const post = await Post.findById(req.params.id);

		const comment = {
			text: req.body.text,
			name: user.name,
			avatar: user.avatar,
			user: req.user.id
		};

		post.comments.unshift(comment);
		await post.save();

		return res.json(post.comments);
	} catch (err) {
		serverError(err, res);
	}
};

// Delete comment
exports.deleteComment = async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({msg: 'Post not found'});

		// Retrieve comment
		const comment = post.comments.find(
			comm => comm.id === req.params.comment_id
		);
		if (!comment) return res.status(404).json({msg: 'Comment not found'});

		if (comment.user.toString() !== req.user.id)
			return res.status(401).json({msg: 'Unauthorized'});

		const removeIndex = post.comments.findIndex(
			comm => comm.id === req.params.comment_id
		);

		if (removeIndex < 0)
			return res.status(404).json({msg: 'Comment not found'});
		post.comments.splice(removeIndex, 1);
		await post.save();

		return res.status(200).json(post.comments);
	} catch (err) {
		serverError(err, res);
	}
};
