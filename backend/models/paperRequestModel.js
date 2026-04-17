const mongoose = require('mongoose');

const paperRequestSchema = mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        academicId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'AcademicStructure',
        },
        requestType: {
            type: String,
            required: true,
            enum: ['previous_year', 'model_paper', 'important_questions'],
        },
        status: {
            type: String,
            required: true,
            enum: ['pending', 'fulfilled', 'cancelled'],
            default: 'pending',
        },
        fulfillmentContent: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicContent',
        }
    },
    {
        timestamps: true,
    }
);

const PaperRequest = mongoose.model('PaperRequest', paperRequestSchema);

module.exports = PaperRequest;
