const ClubProfile = require('../models/clubProfileModel');
const TeamMember = require('../models/teamMemberModel');
const User = require('../models/userModel');

// @desc    Create or Update Club Profile
// @route   POST /api/clubs/profile
// @access  Private (Club/Coordinator)
const upsertClubProfile = async (req, res) => {
    try {
        const profileData = {
            user: req.user._id,
            ...req.body
        };

        // Handle File Uploads
        if (req.files) {
            if (req.files.facultyPhoto) {
                profileData.facultyInCharge = {
                    ...profileData.facultyInCharge,
                    photo: req.files.facultyPhoto[0].path
                };
            }
            if (profileData.studentInCharge && Array.isArray(profileData.studentInCharge)) {
                // If it's passed as a string array, parse it. It's usually parsed by now if json,
                // but formData sends strings. The frontend will stringify the whole array.
            }
            if (typeof profileData.studentInCharge === 'string') {
                try {
                    profileData.studentInCharge = JSON.parse(profileData.studentInCharge);
                } catch (e) {
                    profileData.studentInCharge = [];
                }
            }

            if (req.files.studentPhoto && Array.isArray(profileData.studentInCharge)) {
                let photoIndex = 0;
                profileData.studentInCharge = profileData.studentInCharge.map(lead => {
                    if (lead.hasNewPhoto === 'true' && req.files.studentPhoto[photoIndex]) {
                        lead.photo = req.files.studentPhoto[photoIndex].path;
                        photoIndex++;
                    }
                    return lead;
                });
            }
            if (req.files.gallery) {
                profileData.gallery = req.files.gallery.map(file => file.path);
            }
        }

        if (req.body.clubName) {
            await User.findByIdAndUpdate(req.user._id, { name: req.body.clubName });
        }

        const profile = await ClubProfile.findOneAndUpdate(
            { user: req.user._id },
            profileData,
            { new: true, upsert: true, runValidators: true }
        );

        res.status(200).json(profile);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get current club's profile
// @route   GET /api/clubs/myprofile
// @access  Private (Club/Coordinator)
const getMyClubProfile = async (req, res) => {
    try {
        const profile = await ClubProfile.findOne({ user: req.user._id }).populate('user', 'name email');
        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({ message: 'Profile not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all club profiles
// @route   GET /api/clubs
// @access  Public
const getAllClubs = async (req, res) => {
    try {
        // Return all clubs that have been registered (removing 'approved' filter for visibility)
        const clubs = await ClubProfile.find({ status: { $ne: 'rejected' } }).populate('user', 'name');
        
        // Enhance with member counts
        const enhancedClubs = await Promise.all(clubs.map(async (club) => {
            const memberCount = await TeamMember.countDocuments({ club_id: club.user._id });
            return {
                ...club._doc,
                members: memberCount
            };
        }));

        res.json(enhancedClubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get club profile by ID
// @route   GET /api/clubs/:id
// @access  Public
const getClubById = async (req, res) => {
    try {
        const profile = await ClubProfile.findById(req.params.id).populate('user', 'name email');
        if (profile) {
            const memberCount = await TeamMember.countDocuments({ club_id: profile.user._id });
            res.json({
                ...profile._doc,
                members: memberCount
            });
        } else {
            res.status(404).json({ message: 'Club not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    upsertClubProfile,
    getMyClubProfile,
    getAllClubs,
    getClubById,
};
