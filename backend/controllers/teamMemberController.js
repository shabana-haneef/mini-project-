const TeamMember = require('../models/teamMemberModel');

// @desc    Get all team members for a club
// @route   GET /api/team-members/club/:clubId
// @access  Public
const getTeamMembers = async (req, res) => {
    try {
        const teamMembers = await TeamMember.find({ club_id: req.params.clubId }).sort({ createdAt: 1 });
        res.json(teamMembers);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch team members', error: error.message });
    }
};

// @desc    Create a new team member
// @route   POST /api/team-members
// @access  Private (Club Admin only)
const createTeamMember = async (req, res) => {
    try {
        if (req.user.role !== 'club') {
            return res.status(403).json({ message: 'Not authorized as club admin' });
        }

        // Check for member limit (Max 20)
        const memberCount = await TeamMember.countDocuments({ club_id: req.user._id });
        if (memberCount >= 20) {
            return res.status(400).json({ message: 'Maximum 20 members allowed for one club.' });
        }

        const {
            student_name,
            lead_position,
            phone_number,
            whatsapp_number,
            email
        } = req.body;

        const teamMember = new TeamMember({
            club_id: req.user._id,
            student_name,
            lead_position,
            phone_number,
            whatsapp_number,
            email
        });

        const createdMember = await teamMember.save();
        res.status(201).json(createdMember);

    } catch (error) {
        console.error('Create Team Member Error:', error);
        res.status(500).json({ message: 'Failed to create team member', error: error.message });
    }
};

// @desc    Update a team member
// @route   PUT /api/team-members/:id
// @access  Private (Club Admin only)
const updateTeamMember = async (req, res) => {
    try {
        if (req.user.role !== 'club') {
            return res.status(403).json({ message: 'Not authorized as club admin' });
        }

        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        // Ensure the current user owns this member record
        if (teamMember.club_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this member' });
        }

        const {
            student_name,
            lead_position,
            phone_number,
            whatsapp_number,
            email
        } = req.body;

        teamMember.student_name = student_name || teamMember.student_name;
        teamMember.lead_position = lead_position || teamMember.lead_position;
        teamMember.phone_number = phone_number || teamMember.phone_number;
        teamMember.whatsapp_number = whatsapp_number || teamMember.whatsapp_number;
        teamMember.email = email || teamMember.email;

        const updatedMember = await teamMember.save();
        res.json(updatedMember);

    } catch (error) {
        console.error('Update Team Member Error:', error);
        res.status(500).json({ message: 'Failed to update team member', error: error.message });
    }
};

// @desc    Delete a team member
// @route   DELETE /api/team-members/:id
// @access  Private (Club Admin only)
const deleteTeamMember = async (req, res) => {
    try {
        if (req.user.role !== 'club') {
            return res.status(403).json({ message: 'Not authorized as club admin' });
        }

        const teamMember = await TeamMember.findById(req.params.id);

        if (!teamMember) {
            return res.status(404).json({ message: 'Team member not found' });
        }

        if (teamMember.club_id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete this member' });
        }

        await teamMember.deleteOne();
        res.json({ message: 'Team member removed' });

    } catch (error) {
        console.error('Delete Team Member Error:', error);
        res.status(500).json({ message: 'Failed to delete team member', error: error.message });
    }
};

module.exports = {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
};
