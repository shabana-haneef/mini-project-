const mongoose = require('mongoose');

const activityPostSchema = mongoose.Schema(
    {
        club: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        creatorRole: {
            type: String,
            required: true,
            enum: ['club', 'coordinator'],
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        mediaUrl: {
            type: String,
        },
        type: {
            type: String,
            default: 'announcement', // e.g., 'announcement', 'event', 'update'
        }
    },
    {
        timestamps: true,
    }
);

const ActivityPost = mongoose.model('ActivityPost', activityPostSchema);

module.exports = ActivityPost;
