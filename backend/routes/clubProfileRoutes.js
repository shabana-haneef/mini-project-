const express = require('express');
const router = express.Router();
const {
    upsertClubProfile,
    getMyClubProfile,
    getAllClubs,
    getClubById
} = require('../controllers/clubProfileController');
const { protect, club } = require('../middleware/authMiddleware'); // Assuming this exists or I'll check

const { upload } = require('../config/cloudinary');

router.route('/')
    .get(getAllClubs)
    .post(
        protect,
        club,
        upload.fields([
            { name: 'facultyPhoto', maxCount: 1 },
            { name: 'studentPhoto', maxCount: 10 },
            { name: 'gallery', maxCount: 10 },
        ]),
        upsertClubProfile
    );

router.get('/myprofile', protect, getMyClubProfile);
router.get('/:id', getClubById);

module.exports = router;
