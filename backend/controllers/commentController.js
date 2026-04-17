const Comment = require('../models/commentModel');
const AcademicContent = require('../models/academicContentModel');

// @desc    Add a comment
// @route   POST /api/comments
// @access  Private (Student)
const addComment = async (req, res) => {
    try {
        const { contentId, text } = req.body;

        if (!text || text.trim() === '') {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const content = await AcademicContent.findById(contentId);
        if (!content) {
            return res.status(404).json({ message: "Content not found" });
        }

        if (req.user.role !== 'student' && req.user.role !== 'admin') {
            return res.status(403).json({ message: "Only students can post comments" });
        }

        const comment = await Comment.create({
            content: contentId,
            student: req.user._id,
            text,
            studentName: req.user.name,
            studentEmail: req.user.email
        });

        res.status(201).json(comment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get comments for a content
// @route   GET /api/comments/:contentId
// @access  Private
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ content: req.params.contentId })
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Private (Owner/Admin)
const deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Only owner or admin can delete
        if (comment.student.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(401).json({ message: "Not authorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(req.params.id);
        res.json({ message: "Comment deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    addComment,
    getComments,
    deleteComment
};
