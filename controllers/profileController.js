// const {validationResult} = require('express-validator');

const serverError = require('../helpers/serverError');

const User = require('../models/User');
const Profile = require('../models/Profile');

// To generate a profile object using the fields in the request body
const generateProfileObject = (body, userId) => {
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
	} = body;

	// Build profile object
	const profileFields = {};

	// Required fields
	if (!userId || !status || !skills) {
		return res.status(400).json({msg: 'Invalid data'});
	}
	profileFields.user = userId;
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

	return profileFields;
};

// To update existing profile
const updateProfile = async (userId, profileFields) => {
	return Profile.findOneAndUpdate(
		{user: userId},
		{$set: profileFields},
		{new: true}
	);
};

// To create a new profile
const createProfile = async profileFields => {
	const profile = new Profile(profileFields);
	return profile.save();
};

// CONTROLLERS
exports.currentProfile = async (req, res) => {
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
		return serverError(err, res);
	}
};

// Create or update profile
exports.createOrUpdateProfile = async (req, res) => {
	try {
		const profileFields = generateProfileObject(req.body, req.user.id);

		let profile = await Profile.findOne({user: req.user.id});

		if (profile) {
			// Update profile
			profile = await updateProfile(req.user.id, profileFields);
		} else {
			// Create profile
			profile = await createProfile(profileFields);
		}

		return res.status(200).json(profile);
	} catch (err) {
		return serverError(err, res);
	}
};

// Get all profiles
exports.getAllProfiles = async (req, res) => {
	try {
		const profiles = await Profile.find().populate('user', ['name', 'avatar']);
		res.json(profiles);
	} catch (err) {
		return serverError(err, res);
	}
};

// Get profile by user ID
exports.getProfileById = async (req, res) => {
	try {
		const profile = await Profile.findOne({user: req.params.id}).populate(
			'user',
			['name', 'avatar']
		);
		if (!profile) {
			return res.status(404).json({msg: 'Not found'});
		}
		return res.json(profile);
	} catch (err) {
		if (err.kind == 'ObjectId') {
			return res.status(404).json({msg: 'Not found'});
		}
		return serverError(err, res);
	}
};

// Delete profile, user and posts
exports.deleteProfileUserAndPosts = async (req, res) => {
	try {
		// @TODO: Remove user's posts
		// Remove the profile
		await Profile.findOneAndRemove({user: req.user.id});
		// Remove the user
		await User.findOneAndRemove({_id: req.user.id});
		return res.json({msg: 'User deleted'});
	} catch (err) {
		return serverError(err, res);
	}
};

// Add experience
exports.putExperience = async (req, res) => {
	try {
	} catch (err) {
		return serverError(err, res);
	}
};
