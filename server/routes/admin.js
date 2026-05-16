const express = require('express');
const router = express.Router();
const { getAllUsers, deleteUser, getAnalytics } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

router.get('/users', protect, admin, getAllUsers);
router.delete('/users/:id', protect, admin, deleteUser);
router.get('/analytics', protect, admin, getAnalytics);

module.exports = router;
