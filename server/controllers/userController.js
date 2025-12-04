import User from '../models/User.js';
import Property from '../models/Property.js';

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedProperties');

    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching profile',
      error: error.message
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar } = req.body;

    const fieldsToUpdate = {};
    if (name) fieldsToUpdate.name = name;
    if (phone) fieldsToUpdate.phone = phone;
    if (avatar) fieldsToUpdate.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      data: user
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// @desc    Get user's properties
// @route   GET /api/users/properties
// @access  Private
export const getUserProperties = async (req, res) => {
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

// @desc    Get user's favorite properties
// @route   GET /api/users/favorites
// @access  Private
export const getFavorites = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'savedProperties',
        populate: {
          path: 'owner',
          select: 'name email phone'
        }
      });

    res.status(200).json({
      success: true,
      count: user.savedProperties.length,
      data: user.savedProperties
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching favorites',
      error: error.message
    });
  }
};

// @desc    Add property to favorites
// @route   POST /api/users/favorites/:propertyId
// @access  Private
export const addToFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if already in favorites
    const user = await User.findById(req.user._id);
    if (user.savedProperties.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property already in favorites'
      });
    }

    // Add to favorites
    user.savedProperties.push(propertyId);
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Property added to favorites',
      data: user.savedProperties
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error adding to favorites',
      error: error.message
    });
  }
};

// @desc    Remove property from favorites
// @route   DELETE /api/users/favorites/:propertyId
// @access  Private
export const removeFromFavorites = async (req, res) => {
  try {
    const { propertyId } = req.params;

    const user = await User.findById(req.user._id);

    // Check if property is in favorites
    if (!user.savedProperties.includes(propertyId)) {
      return res.status(400).json({
        success: false,
        message: 'Property not in favorites'
      });
    }

    // Remove from favorites
    user.savedProperties = user.savedProperties.filter(
      id => id.toString() !== propertyId
    );
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Property removed from favorites',
      data: user.savedProperties
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error removing from favorites',
      error: error.message
    });
  }
};
