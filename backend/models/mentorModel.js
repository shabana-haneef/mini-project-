const mongoose = require('mongoose');

const mentorSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        institution: {
            type: String,
            required: true,
        },
        stream: {
            type: String,
            required: true,
        },
        scheme: {
            type: String,
            required: true,
        },
        bio: {
            type: String,
        },
        expertise: [String],
        profileImage: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    }
);

const Mentor = mongoose.model('Mentor', mentorSchema);

module.exports = Mentor;
