const Booking = require('../models/Booking');
const Property = require('../models/Property');
const Notification = require('../models/Notification');

// @desc    Create a booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { propertyId, checkIn, checkOut, guests } = req.body;
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = nights * property.price;

    const booking = await Booking.create({
      user: req.user._id,
      property: propertyId,
      dates: { checkIn: checkInDate, checkOut: checkOutDate },
      guests: guests || { adults: 1, children: 0 },
      totalPrice,
      paymentStatus: 'pending',
      invoiceId: `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    });

    // Create notification
    await Notification.create({
      user: req.user._id,
      type: 'booking_confirmed',
      title: 'Booking Confirmed!',
      message: `Your booking at ${property.title} has been confirmed for ${nights} night(s).`,
      link: `/dashboard/bookings/${booking._id}`,
    });

    // Notify the host
    await Notification.create({
      user: property.host,
      type: 'alert',
      title: 'New Booking Received',
      message: `You have a new booking for ${property.title}. Check-in: ${checkIn}`,
      link: `/host/bookings`,
    });

    const populatedBooking = await Booking.findById(booking._id).populate('property', 'title images location price');
    res.status(201).json(populatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('property', 'title images location price')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get host bookings (bookings for properties the host owns)
// @route   GET /api/bookings/host
// @access  Private/Host
const getHostBookings = async (req, res) => {
  try {
    const properties = await Property.find({ host: req.user._id }).select('_id');
    const propertyIds = properties.map(p => p._id);
    const bookings = await Booking.find({ property: { $in: propertyIds } })
      .populate('property', 'title images location price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings/all
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate('property', 'title images location price')
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update payment status
// @route   PUT /api/bookings/:id/pay
// @access  Private
const updatePaymentStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.paymentStatus = 'paid';
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getUserBookings, getHostBookings, getAllBookings, updatePaymentStatus };
