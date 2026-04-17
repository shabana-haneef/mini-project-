const express = require('express');
const {
    createEvent,
    getEvents,
    getAllEventsForAdmin,
    getClubEvents,
    getEventById,
    updateEventStatus,
    registerForEvent,
    updateEvent,
    deleteEvent,
} = require('../controllers/eventController');
const { protect, admin, club, restrictSuperAdmin } = require('../middleware/authMiddleware');

const { upload } = require('../config/cloudinary');

const router = express.Router();

router.route('/')
    .post(protect, restrictSuperAdmin, club, upload.single('posterImage'), createEvent)
    .get(getEvents);

router.get('/admin', protect, admin, getAllEventsForAdmin);
router.get('/manage', protect, club, getClubEvents);

router.route('/:id')
    .get(getEventById)
    .put(protect, club, upload.single('posterImage'), updateEvent)
    .delete(protect, club, deleteEvent);

router.put('/:id/status', protect, admin, updateEventStatus);
router.post('/:id/register', protect, restrictSuperAdmin, registerForEvent);

module.exports = router;
