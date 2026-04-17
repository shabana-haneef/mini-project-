const mongoose = require('mongoose');

const clubProfileSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
            unique: true,
        },
        category: {
            type: String,
            required: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        description: {
            type: String,
        },
        location: {
            type: String,
        },
        website: {
            type: String,
        },
        socials: {
            instagram: { type: String },
            linkedin: { type: String },
            twitter: { type: String },
            facebook: { type: String },
        },
        facultyInCharge: {
            name: { type: String },
            email: { type: String },
            department: { type: String },
            photo: { type: String },
        },
        studentInCharge: [
            {
                name: { type: String },
                studentId: { type: String },
                department: { type: String },
                email: { type: String },
                photo: { type: String },
            }
        ],
        coordinators: [
            {
                name: { type: String, required: true },
                role: { type: String, required: true },
                sector: { type: String, required: true },
                photo: { type: String },
            },
        ],
        gallery: [
            {
                type: String, // URLs to images
            },
        ],
        achievements: [
            {
                title: { type: String },
                year: { type: String },
            },
        ],
    },
    {
        timestamps: true,
    }
);

const ClubProfile = mongoose.model('ClubProfile', clubProfileSchema);

module.exports = ClubProfile;
