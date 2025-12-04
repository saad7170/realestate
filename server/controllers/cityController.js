import City from '../models/City.js';
import { seedCities } from '../utils/seedCities.js';

// @desc    Get all cities
// @route   GET /api/cities
// @access  Public
export const getCities = async (req, res) => {
  try {
    const cities = await City.find({ isActive: true }).sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: cities.length,
      data: cities
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching cities',
      error: error.message
    });
  }
};

// @desc    Get single city by ID or slug
// @route   GET /api/cities/:identifier
// @access  Public
export const getCity = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Try to find by ID first, then by slug
    let city = await City.findById(identifier);
    if (!city) {
      city = await City.findOne({ slug: identifier });
    }

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    res.status(200).json({
      success: true,
      data: city
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching city',
      error: error.message
    });
  }
};

// @desc    Get popular areas for a city
// @route   GET /api/cities/:identifier/areas
// @access  Public
export const getCityAreas = async (req, res) => {
  try {
    const { identifier } = req.params;
    let city = null;

    // Check if identifier is a valid ObjectId (24 hex characters)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(identifier);

    // Try to find by ID only if it's a valid ObjectId
    if (isValidObjectId) {
      city = await City.findById(identifier);
    }

    // If not found by ID, try by slug (lowercase)
    if (!city) {
      city = await City.findOne({ slug: identifier.toLowerCase() });
    }

    // If still not found, try by name (case-insensitive)
    if (!city) {
      city = await City.findOne({ name: new RegExp(`^${identifier}$`, 'i') });
    }

    if (!city) {
      return res.status(404).json({
        success: false,
        message: 'City not found'
      });
    }

    res.status(200).json({
      success: true,
      count: city.popularAreas.length,
      data: city.popularAreas
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching city areas',
      error: error.message
    });
  }
};

// @desc    Seed cities (Admin only)
// @route   POST /api/cities/seed
// @access  Private/Admin
export const seedCitiesData = async (req, res) => {
  try {
    const result = await seedCities();

    res.status(200).json({
      success: true,
      message: 'Cities seeded successfully',
      count: result.count
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error seeding cities',
      error: error.message
    });
  }
};
