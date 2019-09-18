const express = require('express');
const {check} = require('express-validator');

const auth = require('../../middleware/auth');
const validation = require('../../middleware/validation');

const {
	createPost,
	getPosts,
	getPostById,
	deletePost,
	likePost,
	unlikePost,
	createComment,
	deleteComment
} = require('../../controllers/postController');

const router = express.Router();

// @route  POST api/posts
// @desc   Create post
// @access Private
router.post(
	'/',
	[
		auth,
		check('text', 'Text is required')
			.not()
			.isEmpty(),
		validation
	],
	createPost
);

// @route  GET api/posts
// @desc   Get posts
// @access Private
router.get('/', auth, getPosts);

// @route  GET api/posts/:id
// @desc   Get single post by id
// @access Private
router.get('/:id', auth, getPostById);

// @route  DELETE api/posts/:id
// @desc   Delete post by ID
// @access Private
router.delete('/:id', auth, deletePost);

// @route  PUT api/posts/like/:id
// @desc   Like post
// @access Private
router.put('/like/:id', auth, likePost);

// @route  PUT api/posts/unlike/:id
// @desc   Unlike post
// @access Private
router.put('/unlike/:id', auth, unlikePost);

// @route  POST api/posts/comment/:id
// @desc   Comment on a post
// @access Private
router.post(
	'/comment/:id',
	[
		auth,
		check('text', 'Text is required')
			.not()
			.isEmpty(),
		validation
	],
	createComment
);

// @route  DELETE api/posts/comment/:id/:comment_id
// @desc   Delete comment
// @access Private
router.delete('/comment/:id/:comment_id', auth, deleteComment)

module.exports = router;
