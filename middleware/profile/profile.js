exports.generateProfileObject = (req, res, next) => {
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

	const userId = req.user.id;

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

	req.profile = profileFields;
	next();
};

exports.generateExperienceObject = (req, res, next) => {
	const {title, company, location, from, to, current, description} = req.body;
	const experience = {};

	const userId = req.user.id;

	// Required fields
	if (!userId || !title || !company || !from) {
		return res.status(400).json({msg: 'Invalid data'});
	}
	experience.title = title;
	experience.company = company;
	experience.from = from;

	// Optional fields
	if (location) experience.location = location;
	if (current) experience.current = current;
	else if (to) experience.to = to;
	if (description) experience.description = description;

	req.experience = experience;
	next();
};

exports.generateEducationObject = (req, res, next) => {
	const {
		school,
		degree,
		fieldOfStudy,
		from,
		to,
		current,
		description
	} = req.body;
	const education = {};

	const userId = req.user.id;

	// Required fields
	if (!userId || !school || !degree || !fieldOfStudy || !from) {
		return res.status(400).json({msg: 'Invalid data'});
	}
	education.school = school;
	education.degree = degree;
	education.fieldOfStudy = fieldOfStudy;
	education.from = from;

	// Optional fields
	if (current) education.current = current;
	else if (to) education.to = to;
	if (description) education.description = description;

	req.education = education;
	next();
};
