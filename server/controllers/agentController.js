import User from '../models/User.js';
import Property from '../models/Property.js';
import Inquiry from '../models/Inquiry.js';

// @desc    Get all agents
// @route   GET /api/agents
// @access  Public
export const getAllAgents = async (req, res) => {
  try {
    const { search, specialization, page = 1, limit = 12 } = req.query;

    // Build query
    const query = { role: 'agent' };

    // Search by name or agency
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { agencyName: { $regex: search, $options: 'i' } }
      ];
    }

    // Filter by specialization
    if (specialization) {
      query.specialization = specialization;
    }

    // Execute query with pagination
    const agents = await User.find(query)
      .select('-password')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    // Get property counts for each agent
    const agentsWithCounts = await Promise.all(
      agents.map(async (agent) => {
        const propertyCount = await Property.countDocuments({ 
          owner: agent._id,
          status: 'active'
        });
        
        return {
          ...agent.toObject(),
          propertyCount
        };
      })
    );

    // Get total count
    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: agentsWithCounts.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: agentsWithCounts
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agents',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get agent profile
// @route   GET /api/agents/:id
// @access  Public
export const getAgentProfile = async (req, res) => {
  try {
    const agent = await User.findById(req.params.id).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    if (agent.role !== 'agent') {
      return res.status(400).json({
        success: false,
        message: 'User is not an agent'
      });
    }

    // Get agent statistics
    const totalProperties = await Property.countDocuments({ owner: agent._id });
    const activeProperties = await Property.countDocuments({ 
      owner: agent._id, 
      status: 'active' 
    });
    const soldProperties = await Property.countDocuments({ 
      owner: agent._id, 
      status: 'sold' 
    });
    const rentedProperties = await Property.countDocuments({ 
      owner: agent._id, 
      status: 'rented' 
    });

    res.status(200).json({
      success: true,
      data: {
        ...agent.toObject(),
        stats: {
          totalProperties,
          activeProperties,
          soldProperties,
          rentedProperties
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Update agent profile
// @route   PUT /api/agents/profile
// @access  Private (Agent only)
export const updateAgentProfile = async (req, res) => {
  try {
    // Check if user is an agent
    if (req.user.role !== 'agent') {
      return res.status(403).json({
        success: false,
        message: 'Only agents can update agent profile'
      });
    }

    const { agencyName, licenseNumber, bio, experience, specialization } = req.body;

    // Build update object
    const updateData = {};
    if (agencyName !== undefined) updateData.agencyName = agencyName;
    if (licenseNumber !== undefined) updateData.licenseNumber = licenseNumber;
    if (bio !== undefined) updateData.bio = bio;
    if (experience !== undefined) updateData.experience = experience;
    if (specialization !== undefined) updateData.specialization = specialization;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      success: true,
      message: 'Agent profile updated successfully',
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating agent profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get agent's properties
// @route   GET /api/agents/:id/properties
// @access  Public
export const getAgentProperties = async (req, res) => {
  try {
    const { status, page = 1, limit = 12 } = req.query;

    // Verify agent exists
    const agent = await User.findById(req.params.id);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Build query
    const query = { owner: req.params.id };
    if (status) {
      query.status = status;
    }

    // Get properties
    const properties = await Property.find(query)
      .populate('owner', 'name email phone avatar agencyName')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Property.countDocuments(query);

    res.status(200).json({
      success: true,
      count: properties.length,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent properties',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get agent statistics
// @route   GET /api/agents/:id/stats
// @access  Public
export const getAgentStats = async (req, res) => {
  try {
    // Verify agent exists
    const agent = await User.findById(req.params.id);
    if (!agent || agent.role !== 'agent') {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Get property statistics
    const totalProperties = await Property.countDocuments({ owner: req.params.id });
    const activeProperties = await Property.countDocuments({ 
      owner: req.params.id, 
      status: 'active' 
    });
    const soldProperties = await Property.countDocuments({ 
      owner: req.params.id, 
      status: 'sold' 
    });
    const rentedProperties = await Property.countDocuments({ 
      owner: req.params.id, 
      status: 'rented' 
    });

    // Get inquiry count (inquiries for agent's properties)
    const agentProperties = await Property.find({ owner: req.params.id }).select('_id');
    const propertyIds = agentProperties.map(p => p._id);
    const inquiryCount = await Inquiry.countDocuments({ 
      property: { $in: propertyIds } 
    });

    // Get recent inquiries
    const recentInquiries = await Inquiry.find({ 
      property: { $in: propertyIds } 
    })
      .populate('property', 'title images')
      .populate('sender', 'name email')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      data: {
        properties: {
          total: totalProperties,
          active: activeProperties,
          sold: soldProperties,
          rented: rentedProperties
        },
        inquiries: {
          total: inquiryCount,
          recent: recentInquiries
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};
