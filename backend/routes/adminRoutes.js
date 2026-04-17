const express = require('express');
const router = express.Router();
const {
    getPendingEvents,
    updateEventStatus,
    getPendingClubs,
    updateClubStatus,
    getAllUsers,
    deleteUser
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/events/pending', protect, admin, getPendingEvents);
router.put('/events/:id/status', protect, admin, updateEventStatus);

router.get('/clubs/pending', protect, admin, getPendingClubs);
router.put('/clubs/:id/status', protect, admin, updateClubStatus);

router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);

module.exports = router;
