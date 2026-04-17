const mongoose = require('mongoose');

const commentSchema = mongoose.Schema(
    {
        content: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'AcademicContent',
        },
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        text: {
            type: String,
            required: true,
        },
        studentName: {
            type: String,
            required: true,
        },
        studentEmail: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true,
    }
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
