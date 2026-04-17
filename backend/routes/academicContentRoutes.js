const express = require('express');
const router = express.Router();
const {
    uploadContent,
    getContentBySubject,
    searchContent,
    createPaperRequest,
    deleteContent,
    trackDownload,
    getMyDownloads,
    removePersonalDownload,
    getMentorAnalytics,
    toggleLike,
    addComment,
    rateContent
} = require('../controllers/academicContentController');
const { protect, mentor, restrictSuperAdmin } = require('../middleware/authMiddleware');
const { academicUpload } = require('../config/cloudinary');

router.get('/search', searchContent);
router.get('/subject/:subjectId', getContentBySubject);
router.get('/my-downloads', protect, getMyDownloads);
router.get('/mentor-analytics', protect, getMentorAnalytics);
router.post('/', protect, restrictSuperAdmin, mentor, academicUpload.single('file'), uploadContent);
router.post('/request', protect, restrictSuperAdmin, createPaperRequest);
router.post('/:id/like', protect, restrictSuperAdmin, toggleLike);
router.post('/:id/rate', protect, restrictSuperAdmin, rateContent);
router.post('/:id/comment', protect, restrictSuperAdmin, addComment);
router.post('/download/:id', protect, restrictSuperAdmin, trackDownload);
router.delete('/download/:id', protect, restrictSuperAdmin, removePersonalDownload);
router.delete('/:id', protect, restrictSuperAdmin, mentor, deleteContent);

module.exports = router;
