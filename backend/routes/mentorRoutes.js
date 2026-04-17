const express = require('express');
const router = express.Router();
const {
    getMentorProfile,
    updateMentorProfile,
    getMentors
} = require('../controllers/mentorController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

router.get('/', getMentors);
router.get('/profile', protect, getMentorProfile);
router.put('/profile', protect, upload.single('profileImage'), updateMentorProfile);

module.exports = router;
