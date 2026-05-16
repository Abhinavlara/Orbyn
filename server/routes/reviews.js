const express = require('express');
const router = express.Router();
const { createReview, getPropertyReviews, getAllReviews } = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

router.route('/')
  .post(protect, createReview)
  .get(getAllReviews);

router.get('/:propertyId', getPropertyReviews);

module.exports = router;
