const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const { addReview, getPGReviews } = require('../controllers/reviewController');

router.post('/', verifyToken, addReview);
router.get('/pg/:pgId', getPGReviews);

module.exports = router;
