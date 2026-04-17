const ClubProfile = require('../models/clubProfileModel');
const User = require('../models/userModel');

// @desc    Get all pending events
// @route   GET /api/admin/events/pending
// @access  Private/Admin
const getPendingEvents = async (req, res) => {
    try {
        const events = await Event.find({ status: 'pending' }).populate('coordinator', 'name');
        res.json(events);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or reject an event
// @route   PUT /api/admin/events/:id/status
// @access  Private/Admin
const updateEventStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const event = await Event.findById(req.params.id);
        if (event) {
            event.status = status;
            await event.save();
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all pending clubs
// @route   GET /api/admin/clubs/pending
// @access  Private/Admin
const getPendingClubs = async (req, res) => {
    try {
        const clubs = await ClubProfile.find({ status: 'pending' }).populate('user', 'name');
        res.json(clubs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Approve or reject a club
// @route   PUT /api/admin/clubs/:id/status
// @access  Private/Admin
const updateClubStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['approved', 'rejected'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        const club = await ClubProfile.findById(req.params.id);
        if (club) {
            club.status = status;
            await club.save();
            res.json(club);
        } else {
            res.status(404).json({ message: 'Club not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all users (for management)
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await User.deleteOne({ _id: user._id });
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getPendingEvents,
    updateEventStatus,
    getPendingClubs,
    updateClubStatus,
    getAllUsers,
    deleteUser
};
