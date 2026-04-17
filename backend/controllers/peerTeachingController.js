const PeerTeaching = require('../models/peerTeachingModel');

// @desc    Create a new teaching request or offer
// @route   POST /api/peer-teaching
// @access  Private
const createPeerTeaching = async (req, res) => {
    try {
        const { subject, topic, description, type, sessionDate, category } = req.body;

        const session = await PeerTeaching.create({
            student: req.user._id,
            subject,
            topic,
            description,
            type,
            sessionDate,
            category,
            thumbnail: req.file ? req.file.path : '',
        });

        res.status(201).json(session);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all peer teaching sessions (open)
// @route   GET /api/peer-teaching
// @access  Private
const getPeerTeachingSessions = async (req, res) => {
    try {
        const sessions = await PeerTeaching.find({ status: 'open' })
            .populate('student', 'name email');
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get my peer teaching sessions
// @route   GET /api/peer-teaching/my
// @access  Private
const getMySessions = async (req, res) => {
    try {
        const sessions = await PeerTeaching.find({ student: req.user._id });
        res.json(sessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Express interest in a session
// @route   POST /api/peer-teaching/:id/interest
// @access  Private
const expressInterest = async (req, res) => {
    try {
        const session = await PeerTeaching.findById(req.params.id);

        if (!session) {
            return res.status(404).json({ message: 'Session not found' });
        }

        if (session.student.toString() === req.user._id.toString()) {
            return res.status(400).json({ message: 'You cannot express interest in your own session' });
        }

        if (session.interestedUsers.includes(req.user._id)) {
            return res.status(400).json({ message: 'Already expressed interest' });
        }

        session.interestedUsers.push(req.user._id);
        await session.save();

        res.json({ message: 'Interest registered successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    createPeerTeaching,
    getPeerTeachingSessions,
    getMySessions,
    expressInterest,
};
