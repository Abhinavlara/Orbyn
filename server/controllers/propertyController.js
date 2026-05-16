const Property = require('../models/Property');

// @desc    Get all properties (with filters)
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const { city, country, category, type, minPrice, maxPrice, minRating, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (city) filter['location.city'] = new RegExp(city, 'i');
    if (country) filter['location.country'] = new RegExp(country, 'i');
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter['ratings.average'] = { $gte: Number(minRating) };

    const total = await Property.countDocuments(filter);
    const properties = await Property.find(filter)
      .populate('host', 'name profileImage')
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit))
      .sort({ createdAt: -1 });

    res.json({
      properties,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id).populate('host', 'name profileImage email');
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ message: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a property
// @route   POST /api/properties
// @access  Private/Host
const createProperty = async (req, res) => {
  try {
    const { title, description, location, price, amenities, availability } = req.body;
    
    // Parse location if it comes as a JSON string from FormData
    let parsedLocation = location;
    if (typeof location === 'string') {
      try {
        parsedLocation = JSON.parse(location);
      } catch (e) {
        parsedLocation = { address: location, city: location, country: location };
      }
    }

    // Extract Cloudinary URLs from uploaded files
    const images = req.files ? req.files.map(file => file.path) : [];

    const property = await Property.create({
      host: req.user._id,
      title,
      description,
      location: parsedLocation,
      price: Number(price),
      images: images.length > 0 ? images : req.body.images || [],
      amenities: typeof amenities === 'string' ? amenities.split(',') : (amenities || []),
      availability: availability || [],
    });
    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Host
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const updatedProperty = await Property.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProperty);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Host
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    if (property.host.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getProperties, getPropertyById, createProperty, updateProperty, deleteProperty };
