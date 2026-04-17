const express = require('express');
const { 
    authUser, 
    registerUser, 
    logoutUser, 
    updateUserProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { profileUpload } = require('../config/cloudinary');

const router = express.Router();

router.post('/signup', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);

router.put('/profile', protect, profileUpload.single('profilePicture'), updateUserProfile);

module.exports = router;
