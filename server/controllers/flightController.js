const Flight = require('../models/Flight');

// @desc    Search flights
// @route   GET /api/flights
// @access  Public
const searchFlights = async (req, res) => {
  try {
    const { from, to, date, passengers, flightClass, maxPrice, stops, sortBy } = req.query;
    const filter = {};

    if (from) filter['from.code'] = new RegExp(from, 'i');
    if (to) filter['to.code'] = new RegExp(to, 'i');
    if (flightClass) filter.class = flightClass;
    if (maxPrice) filter.price = { $lte: Number(maxPrice) };
    if (stops !== undefined && stops !== '') filter.stops = Number(stops);
    if (passengers) filter.seatsAvailable = { $gte: Number(passengers) };

    let sort = { price: 1 };
    if (sortBy === 'duration') sort = { duration: 1 };
    if (sortBy === 'departure') sort = { departureTime: 1 };
    if (sortBy === 'price-desc') sort = { price: -1 };

    const flights = await Flight.find(filter).sort(sort);
    res.json({ flights, total: flights.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single flight
// @route   GET /api/flights/:id
// @access  Public
const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (flight) {
      res.json(flight);
    } else {
      res.status(404).json({ message: 'Flight not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchFlights, getFlightById };
