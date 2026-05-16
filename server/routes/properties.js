const express = require('express');
const router = express.Router();
const { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty } = require('../controllers/propertyController');
const { protect, host } = require('../middleware/auth');

const upload = require('../middleware/upload');

router.route('/').get(getProperties).post(protect, host, upload.array('images', 10), createProperty);
router.route('/:id').get(getPropertyById).put(protect, host, updateProperty).delete(protect, host, deleteProperty);

module.exports = router;
