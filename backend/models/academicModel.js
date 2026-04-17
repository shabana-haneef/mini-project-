const mongoose = require('mongoose');

const academicSchema = mongoose.Schema(
    {
        university: {
            type: String,
            required: true,
            default: 'KTU'
        },
        scheme: {
            type: String,
            required: true, // e.g., '2019 Scheme', '2022 Scheme'
        },
        stream: {
            type: String,
            required: true, // e.g., 'CSE', 'ECE', 'ME'
        },
        year: {
            type: Number,
            required: true, // 1, 2, 3, 4
        },
        semester: {
            type: Number,
            required: true, // 1 to 8
        },
        subjectName: {
            type: String,
            required: true,
        },
        subjectCode: {
            type: String,
            required: true,
        },
        credits: {
            type: Number,
        }
    },
    {
        timestamps: true,
    }
);

// Indexing for faster cascading lookups
academicSchema.index({ university: 1, scheme: 1, stream: 1, semester: 1 });

const AcademicStructure = mongoose.model('AcademicStructure', academicSchema);

module.exports = AcademicStructure;
