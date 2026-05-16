const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, getHostBookings, getAllBookings, updatePaymentStatus } = require('../controllers/bookingController');
const { protect, host, admin } = require('../middleware/auth');

router.route('/').post(protect, createBooking).get(protect, getUserBookings);
router.get('/my-bookings', protect, getUserBookings);
router.get('/host', protect, host, getHostBookings);
router.get('/all', protect, admin, getAllBookings);
router.put('/:id/pay', protect, updatePaymentStatus);

module.exports = router;
