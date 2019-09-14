const express = require('express');
const {check, validationResult} = require('express-validator');

const auth = require('../../middleware/auth');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

const {
	currentProfile,
	createOrUpdateProfile
} = require('../../controllers/profileController');

const router = express.Router();

// @route  GET api/profile/me
// @desc   Get current user's profile
// @access Private
router.get(
	'/me',
	auth,
	currentProfile /* async (req, res) => {
	try {
		const profile = await Profile.findOne({user: req.user.id}).populate(
			'user',
			['name', 'avatar']
		);
		if (!profile) {
			return res.status(400).json({msg: 'There is no profile for this user.'});
		}
		return res.status(200).json(profile);
	} catch (err) {
		console.error(err.message);
		res.status(500).json({msg: 'Internal server error'});
	}
} */
);

// @route  POST api/profile
// @desc   Create or update profile for current user
// @access Private
router.post(
	'/',
	[
		auth,
		check('status', 'Status is required')
			.not()
			.isEmpty(),
		check('skills', 'Skills required')
			.not()
			.isEmpty()
	],
	createOrUpdateProfile
	/* async (req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json({errors: errors.array()});
			}
			const {
				company,
				website,
				location,
				bio,
				status,
				githubUsername,
				skills,
				youtube,
				facebook,
				twitter,
				instagram,
				linkedin
			} = req.body;

			// Build profile object
			const profileFields = {};

			// Required fields
			if (!req.user || !status || !skills) {
				return res.status(400).json({msg: 'Invalid data'});
			}
			profileFields.user = req.user.id;
			profileFields.status = status;
			profileFields.skills = skills.split(',').map(skill => skill.trim());

			// Optional fields
			if (company) profileFields.company = company;
			if (location) profileFields.location = location;
			if (website) profileFields.website = website;
			if (bio) profileFields.bio = bio;
			if (githubUsername) profileFields.githubUsername = githubUsername;

			// Build social object
			const social = {};
			if (youtube) social.youtube = youtube;
			if (facebook) social.facebook = facebook;
			if (twitter) social.twitter = twitter;
			if (instagram) social.instagram = instagram;
			if (linkedin) social.linkedin = linkedin;

			profileFields.social = social;

			let profile = await Profile.findOne({user: req.user.id});
			if (profile) {
				// Update profile
				profile = await Profile.findOneAndUpdate(
					{user: req.user.id},
					{$set: profileFields},
					{new: true}
				);
			} else {
				// Create profile
				profile = new Profile(profileFields);
				profile = await profile.save();
			}

			return res.status(200).json(profile);
		} catch (err) {
			console.error(err.message);
			res.status(500).json({msg: 'Internal server error'});
		}
	} */
);

module.exports = router;
