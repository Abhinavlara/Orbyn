const Train = require('../models/Train');

// @desc    Search trains
// @route   GET /api/trains/search
// @access  Public
const searchTrains = async (req, res) => {
  try {
    const { from, to, date, class: travelClass } = req.query;
    let query = {};

    if (from) query['from.city'] = { $regex: from, $options: 'i' };
    if (to) query['to.city'] = { $regex: to, $options: 'i' };

    const trains = await Train.find(query);
    
    // Filter by class if provided (optional in DB, but good for UI)
    const filteredTrains = travelClass 
      ? trains.filter(t => t.classes.some(c => c.type === travelClass))
      : trains;

    res.json({
      success: true,
      total: filteredTrains.length,
      trains: filteredTrains
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get train by ID
// @route   GET /api/trains/:id
// @access  Public
const getTrainById = async (req, res) => {
  try {
    const train = await Train.findById(req.params.id);
    if (!train) return res.status(404).json({ message: 'Train not found' });
    res.json(train);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stations for autocomplete
// @route   GET /api/trains/stations
const getStations = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json([]);
    
    const stations = await Train.aggregate([
      { $project: { stations: ['$from', '$to'] } },
      { $unwind: '$stations' },
      { $match: { 'stations.city': { $regex: q, $options: 'i' } } },
      { $group: { _id: '$stations.code', station: { $first: '$stations' } } },
      { $limit: 10 }
    ]);

    res.json(stations.map(s => s.station));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { searchTrains, getTrainById, getStations };
