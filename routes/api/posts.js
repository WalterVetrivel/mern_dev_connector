const express = require('express');

const router = express.Router();

// @route  POST api/posts
// @desc   Create post
// @access Private
router.get('/', (req, res) => res.send('Posts route'));

module.exports = router;
