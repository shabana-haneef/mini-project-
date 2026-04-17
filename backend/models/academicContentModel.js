const mongoose = require('mongoose');

const academicContentSchema = mongoose.Schema(
    {
        mentor: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        academicId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'AcademicStructure',
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        contentType: {
            type: String,
            required: true,
            enum: ['video', 'notes', 'ppt', 'paper'],
        },
        fileUrl: {
            type: String,
        },
        youtubeUrl: {
            type: String,
        },
        tags: [String],
        views: {
            type: Number,
            default: 0
        },
        downloads: {
            type: Number,
            default: 0
        },
        downloadedBy: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        likes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        comments: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            text: {
                type: String,
                required: true
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        ratings: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            createdAt: {
                type: Date,
                default: Date.now
            }
        }],
        status: {
            type: String,
            enum: ['active', 'deleted'],
            default: 'active'
        }
    },
    {
        timestamps: true,
    }
);

const AcademicContent = mongoose.model('AcademicContent', academicContentSchema);

module.exports = AcademicContent;
