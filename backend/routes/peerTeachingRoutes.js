const express = require('express');
const {
    createPeerTeaching,
    getPeerTeachingSessions,
    getMySessions,
    expressInterest,
} = require('../controllers/peerTeachingController');
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.route('/')
    .post(protect, upload.single('thumbnail'), createPeerTeaching)
    .get(protect, getPeerTeachingSessions);

router.get('/my', protect, getMySessions);
router.post('/:id/interest', protect, expressInterest);

module.exports = router;
