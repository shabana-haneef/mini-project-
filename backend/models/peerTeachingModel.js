const mongoose = require('mongoose');

const peerTeachingSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        subject: {
            type: String,
            required: true,
        },
        topic: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
            enum: ['request', 'offer', 'class'], // class is for official mentor uploads
        },
        category: {
            type: String,
            default: 'General',
        },
        thumbnail: {
            type: String,
            default: '',
        },
        status: {
            type: String,
            required: true,
            enum: ['open', 'in-progress', 'completed', 'cancelled'],
            default: 'open',
        },
        interestedUsers: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        enrolledStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
            },
        ],
        sessionDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

const PeerTeaching = mongoose.model('PeerTeaching', peerTeachingSchema);

module.exports = PeerTeaching;
