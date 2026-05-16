const express = require('express');
const router = express.Router();
const { registerUser, loginUser, logoutUser, getUserProfile, updateUserProfile, toggleWishlist, sendOTP, verifyOTP, testOTP } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

const passport = require('passport');
const jwt = require('jsonwebtoken');

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/test-otp', testOTP);

// Middleware to check if Google Auth is configured
const checkGoogleAuth = (req, res, next) => {
  if (!process.env.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID === 'your_google_client_id_here') {
    return res.status(400).json({ 
      message: 'Google Login is not configured', 
      error: 'Please add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to the server/.env file' 
    });
  }
  next();
};

// Google OAuth Routes
router.get('/google', checkGoogleAuth, passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login`, session: false }),
  (req, res) => {
    // Generate token
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    // Pass token to frontend as query param
    res.redirect(`${process.env.FRONTEND_URL}/profile?token=${token}`);
  }
);

router.route('/profile').get(protect, getUserProfile).put(protect, updateUserProfile);
router.put('/wishlist/:propertyId', protect, toggleWishlist);

module.exports = router;
