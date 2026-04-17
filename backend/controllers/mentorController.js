const Mentor = require('../models/mentorModel');
const User = require('../models/userModel');

// @desc    Get mentor profile
// @route   GET /api/mentor/profile
// @access  Private (Mentor)
const getMentorProfile = async (req, res) => {
    const mentor = await Mentor.findOne({ user: req.user._id }).populate('user', 'name email profilePicture');
    if (mentor) {
        res.json(mentor);
    } else {
        res.status(404).json({ message: 'Mentor profile not found' });
    }
};

// @desc    Update mentor profile
// @route   PUT /api/mentor/profile
// @access  Private (Mentor)
const updateMentorProfile = async (req, res) => {
    const mentor = await Mentor.findOne({ user: req.user._id });

    if (mentor) {
        mentor.institution = req.body.institution || mentor.institution;
        mentor.stream = req.body.stream || mentor.stream;
        mentor.scheme = req.body.scheme || mentor.scheme;
        mentor.bio = req.body.bio || mentor.bio;
        mentor.expertise = req.body.expertise || mentor.expertise;

        if (req.file) {
            mentor.profileImage = req.file.path;
        }

        const updatedMentor = await mentor.save();
        res.json(updatedMentor);
    } else {
        res.status(404).json({ message: 'Mentor profile not found' });
    }
};

// @desc    Get all mentors (Public/Student)
// @route   GET /api/mentor
// @access  Public
const getMentors = async (req, res) => {
    const mentors = await Mentor.find({ isVerified: true }).populate('user', 'name profilePicture bio');
    res.json(mentors);
};

module.exports = {
    getMentorProfile,
    updateMentorProfile,
    getMentors
};
