const ActivityPost = require('../models/activityPostModel');

// @desc    Create a new activity post
// @route   POST /api/activity-posts
// @access  Private (Club/Coordinator)
const createPost = async (req, res) => {
    try {
        const { title, description, mediaUrl, type } = req.body;

        const post = await ActivityPost.create({
            title,
            description,
            mediaUrl,
            type,
            club: req.user.role === 'club' ? req.user._id : req.user.clubId, // Assuming coordinator has clubId
            createdBy: req.user._id,
            creatorRole: req.user.role,
        });

        res.status(201).json(post);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Get all activity posts
// @route   GET /api/activity-posts
// @access  Private
const getPosts = async (req, res) => {
    try {
        const filter = {};
        if (req.query.clubId) {
            filter.club = req.query.clubId;
        }

        const posts = await ActivityPost.find(filter)
            .populate('club', 'name profilePicture')
            .populate('createdBy', 'name')
            .sort({ createdAt: -1 });

        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete an activity post
// @route   DELETE /api/activity-posts/:id
// @access  Private (Owner Only)
const deletePost = async (req, res) => {
    try {
        const post = await ActivityPost.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Ownership check
        if (post.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'You do not have permission to delete this post.' });
        }

        await post.deleteOne();
        res.json({ message: 'Post removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createPost,
    getPosts,
    deletePost,
};
