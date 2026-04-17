const express = require('express');
const router = express.Router();
const {
    createPost,
    getPosts,
    deletePost
} = require('../controllers/activityPostController');
const { protect, coordinator } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getPosts)
    .post(protect, createPost); // We allow both club and coordinator to post in controller logic

router.route('/:id')
    .delete(protect, deletePost);

module.exports = router;
