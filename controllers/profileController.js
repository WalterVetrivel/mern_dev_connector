const serverError = require('../helpers/serverError');

const User = require('../models/User');
const Profile = require('../models/Profile');

// CONTROLLERS
// Get current user's profile
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

// To update existing profile
const updateProfile = async (userId, profileFields) => {
	return Profile.findOneAndUpdate(
		{user: userId},
		{$set: profileFields},
		{new: true}
	);
};

// To create a new profile on the database
const createProfile = async profileFields => {
	const profile = new Profile(profileFields);
	return profile.save();
};

// Create or update profile
exports.createOrUpdateProfile = async (req, res) => {
	try {
		const profileFields = req.profile;

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
		const experience = req.experience;
		let profile = await Profile.findOne({user: req.user.id});
		profile.experience.unshift(experience);

		profile = await profile.save();
		res.status(200).json(profile);
	} catch (err) {
		return serverError(err, res);
	}
};

// Delete experience
exports.deleteExperience = async (req, res) => {
	try {
		const profile = await Profile.findOne({user: req.user.id});

		// Get remove index
		const removeIndex = profile.experience
			.map(item => item.id)
			.indexOf(req.params.exp_id);

		// Remove experience at index
		if (removeIndex < 0) return res.status(404).json({msg: 'Not found'});
		profile.experience.splice(removeIndex, 1);

		await profile.save();
		return res.status(200).json({profile});
	} catch (err) {
		return serverError(err, res);
	}
};

// Add experience
exports.putEducation = async (req, res) => {
	try {
		const education = req.education;
		let profile = await Profile.findOne({user: req.user.id});
		profile.education.unshift(education);

		profile = await profile.save();
		res.status(200).json(profile);
	} catch (err) {
		return serverError(err, res);
	}
};

// Delete experience
exports.deleteEducation = async (req, res) => {
	try {
		const profile = await Profile.findOne({user: req.user.id});

		// Get remove index
		const removeIndex = profile.education
			.map(item => item.id)
			.indexOf(req.params.edu_id);

		// Remove experience at index
		if (removeIndex < 0) return res.status(404).json({msg: 'Not found'});
		profile.education.splice(removeIndex, 1);

		await profile.save();
		return res.status(200).json({profile});
	} catch (err) {
		return serverError(err, res);
	}
};
