const express = require('express');
const router = express.Router();
const {
    addComment,
    getComments,
    deleteComment
} = require('../controllers/commentController');
const { protect, restrictSuperAdmin } = require('../middleware/authMiddleware');

router.get('/:contentId', protect, getComments);
router.post('/', protect, restrictSuperAdmin, addComment);
router.delete('/:id', protect, restrictSuperAdmin, deleteComment);

module.exports = router;
