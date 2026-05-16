const Review = require('../models/Review');
const Property = require('../models/Property');

// @desc    Create a review for a property
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
  try {
    const { propertyId, rating, comment } = req.body;
    const alreadyReviewed = await Review.findOne({ user: req.user._id, property: propertyId });
    if (alreadyReviewed) {
      return res.status(400).json({ message: 'Already reviewed this property' });
    }

    const review = await Review.create({
      user: req.user._id,
      property: propertyId,
      rating,
      comment,
    });

    // Update property ratings
    const reviews = await Review.find({ property: propertyId });
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    await Property.findByIdAndUpdate(propertyId, {
      'ratings.average': Math.round(avg * 10) / 10,
      'ratings.count': reviews.length,
    });

    const populatedReview = await Review.findById(review._id).populate('user', 'name profileImage');
    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a property
// @route   GET /api/reviews/:propertyId
// @access  Public
const getPropertyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ property: req.params.propertyId })
      .populate('user', 'name profileImage')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('user', 'name profileImage')
      .populate('property', 'title')
      .sort({ createdAt: -1 })
      .limit(6);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createReview, getPropertyReviews, getAllReviews };
