const mongoose = require('mongoose');

const downloadSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        content: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'AcademicContent',
        },
        downloadDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

const Download = mongoose.model('Download', downloadSchema);

module.exports = Download;
