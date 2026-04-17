const express = require('express');
const router = express.Router();
const {
    getTeamMembers,
    createTeamMember,
    updateTeamMember,
    deleteTeamMember
} = require('../controllers/teamMemberController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
    .post(protect, createTeamMember);

router.route('/club/:clubId')
    .get(getTeamMembers);

router.route('/:id')
    .put(protect, updateTeamMember)
    .delete(protect, deleteTeamMember);

module.exports = router;
