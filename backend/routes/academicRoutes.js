const express = require('express');
const router = express.Router();
const {
    getUniversities,
    getSchemes,
    getStreams,
    getSemesters,
    getSubjects,
    seedAcademicData
} = require('../controllers/academicController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/universities', getUniversities);
router.get('/schemes', getSchemes);
router.get('/streams', getStreams);
router.get('/semesters', getSemesters);
router.get('/subjects', getSubjects);

// Admin only seeding route for development
router.post('/seed', seedAcademicData);

module.exports = router;
