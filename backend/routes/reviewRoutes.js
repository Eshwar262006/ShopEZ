const router = require('express').Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.get('/:productId', getReviews);
router.post('/:productId', protect, addReview);
router.delete('/:id', protect, deleteReview);

module.exports = router;
