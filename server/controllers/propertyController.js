import Property from '../models/Property.js';

// @desc    Get all properties with filters
// @route   GET /api/properties
// @access  Public
export const getProperties = async (req, res) => {
  try {
    // Build query
    const query = {};

    // Filter by purpose (buy/rent)
    if (req.query.purpose) {
      query.purpose = req.query.purpose;
    }

    // Filter by property type (home/plot/commercial)
    if (req.query.propertyType) {
      query.propertyType = req.query.propertyType;
    }

    // Filter by sub-type
    if (req.query.subType) {
      query.subType = req.query.subType;
    }

    // Filter by city
    if (req.query.city) {
      query['location.city'] = { $regex: req.query.city, $options: 'i' };
    }

    // Filter by area/location (flexible matching)
    if (req.query.area) {
      // Remove common prefixes and normalize the search term
      const searchTerm = req.query.area
        .replace(/^(Sector\s+|Phase\s+)/i, '') // Remove "Sector " or "Phase " prefix
        .replace(/[-\s]/g, ''); // Remove hyphens and spaces for flexible matching

      // Create a regex that matches with or without hyphens/spaces
      const flexiblePattern = searchTerm.split('').join('[-\\s]*');
      query['location.area'] = { $regex: flexiblePattern, $options: 'i' };
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      query.price = {};
      if (req.query.minPrice) query.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) query.price.$lte = Number(req.query.maxPrice);
    }

    // Filter by area size range
    if (req.query.minArea || req.query.maxArea) {
      query['area.value'] = {};
      if (req.query.minArea) query['area.value'].$gte = Number(req.query.minArea);
      if (req.query.maxArea) query['area.value'].$lte = Number(req.query.maxArea);
    }

    // Filter by area unit
    if (req.query.areaUnit) {
      query['area.unit'] = req.query.areaUnit;
    }

    // Filter by bedrooms
    if (req.query.bedrooms) {
      if (req.query.bedrooms === '5+') {
        query['features.bedrooms'] = { $gte: 5 };
      } else {
        query['features.bedrooms'] = Number(req.query.bedrooms);
      }
    }

    // Filter by bathrooms
    if (req.query.bathrooms) {
      query['features.bathrooms'] = Number(req.query.bathrooms);
    }

    // Filter by status (default to active)
    query.status = req.query.status || 'active';

    // Filter by featured
    if (req.query.featured === 'true') {
      query.featured = true;
    }

    // Filter by agent (owner)
    if (req.query.agent) {
      query.owner = req.query.agent;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    // Sorting
    let sort = {};
    if (req.query.sort) {
      const sortBy = req.query.sort;
      switch (sortBy) {
        case 'price-asc':
          sort = { price: 1 };
          break;
        case 'price-desc':
          sort = { price: -1 };
          break;
        case 'area-asc':
          sort = { 'area.value': 1 };
          break;
        case 'area-desc':
          sort = { 'area.value': -1 };
          break;
        case 'oldest':
          sort = { createdAt: 1 };
          break;
        case 'newest':
        default:
          sort = { createdAt: -1 };
      }
    } else {
      sort = { createdAt: -1 }; // Default: newest first
    }

    // Execute query
    const properties = await Property.find(query)
      .populate('owner', 'name email phone role avatar agencyName licenseNumber bio experience specialization')
      .sort(sort)
      .skip(skip)
      .limit(limit);

    // Get total count for pagination
    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
export const getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('owner', 'name email phone role avatar agencyName licenseNumber bio experience specialization');

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Increment views
    property.views += 1;
    await property.save();

    res.status(200).json({
      success: true,
      data: property
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching property',
      error: error.message
    });
  }
};

// @desc    Create new property
// @route   POST /api/properties
// @access  Private
export const createProperty = async (req, res) => {
  try {
    console.log('Creating property with data:', JSON.stringify(req.body, null, 2));

    // Add user as property owner
    req.body.owner = req.user._id;

    const property = await Property.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Property created successfully',
      data: property
    });

  } catch (error) {
    console.error('Property creation error:', error);

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => ({
        field: err.path,
        message: err.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors,
        details: error.message
      });
    }

    res.status(400).json({
      success: false,
      message: 'Error creating property',
      error: error.message
    });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private (Owner only)
export const updateProperty = async (req, res) => {
  try {
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership (or admin)
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this property'
      });
    }

    // Don't allow changing owner
    delete req.body.owner;

    property = await Property.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Property updated successfully',
      data: property
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating property',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private (Owner only)
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check ownership (or admin)
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this property'
      });
    }

    await property.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Property deleted successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

// @desc    Get similar properties
// @route   GET /api/properties/:id/similar
// @access  Public
export const getSimilarProperties = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Find similar properties (same type, city, similar price range)
    const priceRange = property.price * 0.3; // 30% price variation
    const similarProperties = await Property.find({
      _id: { $ne: property._id },
      propertyType: property.propertyType,
      'location.city': property.location.city,
      price: {
        $gte: property.price - priceRange,
        $lte: property.price + priceRange
      },
      status: 'active'
    })
      .limit(6)
      .populate('owner', 'name phone avatar agencyName role');

    res.status(200).json({
      success: true,
      count: similarProperties.length,
      data: similarProperties
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching similar properties',
      error: error.message
    });
  }
};

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
export const getFeaturedProperties = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 6;

    const properties = await Property.find({
      featured: true,
      status: 'active'
    })
      .populate('owner', 'name phone')
      .sort({ createdAt: -1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: properties.length,
      data: properties
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching featured properties',
      error: error.message
    });
  }
};

// @desc    Get user's own properties
// @route   GET /api/properties/my-properties
// @access  Private
export const getMyProperties = async (req, res) => {
  try {
    // Build query
    const query = { owner: req.user._id };

    // Filter by status if provided
    if (req.query.status) {
      query.status = req.query.status;
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    const properties = await Property.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: properties
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// @desc    Get property statistics
// @route   GET /api/properties/stats
// @access  Public
export const getPropertyStats = async (req, res) => {
  try {
    const stats = await Property.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: null,
          totalProperties: { $sum: 1 },
          totalForSale: {
            $sum: { $cond: [{ $eq: ['$purpose', 'buy'] }, 1, 0] }
          },
          totalForRent: {
            $sum: { $cond: [{ $eq: ['$purpose', 'rent'] }, 1, 0] }
          },
          totalHomes: {
            $sum: { $cond: [{ $eq: ['$propertyType', 'home'] }, 1, 0] }
          },
          totalPlots: {
            $sum: { $cond: [{ $eq: ['$propertyType', 'plot'] }, 1, 0] }
          },
          totalCommercial: {
            $sum: { $cond: [{ $eq: ['$propertyType', 'commercial'] }, 1, 0] }
          },
          avgPrice: { $avg: '$price' },
          minPrice: { $min: '$price' },
          maxPrice: { $max: '$price' }
        }
      }
    ]);

    // Get properties by city
    const citiesStats = await Property.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      },
      {
        $limit: 10
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        overall: stats[0] || {},
        topCities: citiesStats
      }
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching statistics',
      error: error.message
    });
  }
};

// @desc    Seed properties with sample data
// @route   POST /api/properties/seed
// @access  Public
export const seedPropertiesData = async (req, res) => {
  try {
    const { seedProperties } = await import('../utils/seedProperties.js');
    const result = await seedProperties();

    res.status(result.success ? 201 : 400).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error seeding properties',
      error: error.message
    });
  }
};

// @desc    Clear all properties
// @route   DELETE /api/properties/seed
// @access  Public (use with caution!)
export const clearPropertiesData = async (req, res) => {
  try {
    const { clearProperties } = await import('../utils/seedProperties.js');
    const result = await clearProperties();

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error clearing properties',
      error: error.message
    });
  }
};
