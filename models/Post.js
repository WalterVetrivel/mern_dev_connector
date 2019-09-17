const mongoose = require('mongoose');

const Post = new mongoose.Schema({});

module.exports = mongoose.model('Post', Post);
