const mongoose = require('mongoose');

const teamMemberSchema = mongoose.Schema(
    {
        club_id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        student_name: {
            type: String,
            required: true,
        },
        lead_position: {
            type: String,
            required: true,
        },
        phone_number: {
            type: String,
            required: true,
        },
        whatsapp_number: {
            type: String,
            required: true,
        },
        email: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const TeamMember = mongoose.model('TeamMember', teamMemberSchema);

module.exports = TeamMember;
