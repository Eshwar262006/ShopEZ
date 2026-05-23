const Review = require('../models/Review');
const Product = require('../models/Product');

// @desc  Get reviews for a product
// @route GET /api/reviews/:productId
const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate('user', 'name avatar')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Add review
// @route POST /api/reviews/:productId
const addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const existing = await Review.findOne({ product: req.params.productId, user: req.user._id });
    if (existing) return res.status(400).json({ message: 'You already reviewed this product' });

    const review = await Review.create({
      product: req.params.productId,
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    });

    // Recalculate product ratings
    const reviews = await Review.find({ product: req.params.productId });
    const avgRating = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Product.findByIdAndUpdate(req.params.productId, {
      ratings: avgRating,
      numReviews: reviews.length,
    });

    res.status(201).json(review);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

// @desc  Delete review
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Review not found' });
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin')
      return res.status(403).json({ message: 'Unauthorized' });

    const productId = review.product;
    await review.deleteOne();

    const reviews = await Review.find({ product: productId });
    const avgRating = reviews.length > 0 ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length : 0;
    await Product.findByIdAndUpdate(productId, { ratings: avgRating, numReviews: reviews.length });

    res.json({ message: 'Review removed' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

module.exports = { getReviews, addReview, deleteReview };
