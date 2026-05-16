const express = require('express');
const router = express.Router();
const { searchTrains, getTrainById, getStations } = require('../controllers/trainController');

router.get('/search', searchTrains);
router.get('/stations', getStations);
router.get('/:id', getTrainById);

module.exports = router;
