import User from '../models/User.js';
import Property from '../models/Property.js';
import bcrypt from 'bcryptjs';

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAllUsers = async (req, res) => {
  try {
    const { role, isActive, search } = req.query;
    
    // Build query
    let query = {};
    
    if (role) {
      query.role = role;
    }
    
    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
};

// @desc    Get single user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Get user's properties count
    const propertyCount = await Property.countDocuments({ owner: user._id });
    
    res.json({
      success: true,
      data: {
        ...user.toObject(),
        propertyCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
};

// @desc    Create new user
// @route   POST /api/admin/users
// @access  Private/Admin
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role, isActive } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'buyer',
      isActive: isActive !== undefined ? isActive : true
    });
    
    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;
    
    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating user',
      error: error.message
    });
  }
};

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
export const updateUser = async (req, res) => {
  try {
    const { name, email, phone, role, isActive, agencyName, licenseNumber, bio, experience, specialization } = req.body;
    
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    
    // Update agent-specific fields if role is agent
    if (role === 'agent' || user.role === 'agent') {
      if (agencyName !== undefined) user.agencyName = agencyName;
      if (licenseNumber !== undefined) user.licenseNumber = licenseNumber;
      if (bio !== undefined) user.bio = bio;
      if (experience !== undefined) user.experience = experience;
      if (specialization !== undefined) user.specialization = specialization;
    }
    
    await user.save();
    
    // Remove password from response
    const userResponse = await User.findById(user._id).select('-password');
    
    res.json({
      success: true,
      message: 'User updated successfully',
      data: userResponse
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating user',
      error: error.message
    });
  }
};

// @desc    Toggle user active status
// @route   PATCH /api/admin/users/:id/status
// @access  Private/Admin
export const toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from deactivating themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot deactivate your own account'
      });
    }
    
    user.isActive = !user.isActive;
    await user.save();
    
    res.json({
      success: true,
      message: `User ${user.isActive ? 'activated' : 'deactivated'} successfully`,
      data: {
        _id: user._id,
        isActive: user.isActive
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error toggling user status',
      error: error.message
    });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account'
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    
    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting user',
      error: error.message
    });
  }
};

// @desc    Get dashboard statistics
// @route   GET /api/admin/stats/dashboard
// @access  Private/Admin
export const getDashboardStats = async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProperties = await Property.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const totalAgents = await User.countDocuments({ role: 'agent' });
    const totalOwners = await User.countDocuments({ role: { $in: ['seller', 'agent'] } });
    
    // Property stats
    const activeProperties = await Property.countDocuments({ status: 'active' });
    const soldProperties = await Property.countDocuments({ status: 'sold' });
    const rentedProperties = await Property.countDocuments({ status: 'rented' });
    
    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Recent properties
    const recentProperties = await Property.find()
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 })
      .limit(5);
    
    res.json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          active: activeUsers,
          inactive: totalUsers - activeUsers,
          agents: totalAgents,
          owners: totalOwners
        },
        properties: {
          total: totalProperties,
          active: activeProperties,
          sold: soldProperties,
          rented: rentedProperties,
          inactive: totalProperties - activeProperties - soldProperties - rentedProperties
        },
        recent: {
          users: recentUsers,
          properties: recentProperties
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: error.message
    });
  }
};

// @desc    Get property statistics
// @route   GET /api/admin/stats/properties
// @access  Private/Admin
export const getPropertyStats = async (req, res) => {
  try {
    // Properties by status
    const byStatus = await Property.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Properties by type
    const byType = await Property.aggregate([
      {
        $group: {
          _id: '$propertyType',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Properties by purpose
    const byPurpose = await Property.aggregate([
      {
        $group: {
          _id: '$purpose',
          count: { $sum: 1 }
        }
      }
    ]);
    
    // Properties by city
    const byCity = await Property.aggregate([
      {
        $group: {
          _id: '$location.city',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    res.json({
      success: true,
      data: {
        byStatus,
        byType,
        byPurpose,
        byCity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching property statistics',
      error: error.message
    });
  }
};

// @desc    Get agent statistics
// @route   GET /api/admin/stats/agents
// @access  Private/Admin
export const getAgentStats = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    
    const agentStats = await Promise.all(
      agents.map(async (agent) => {
        const properties = await Property.find({ owner: agent._id });
        
        const stats = {
          agent: agent,
          totalProperties: properties.length,
          activeProperties: properties.filter(p => p.status === 'active').length,
          soldProperties: properties.filter(p => p.status === 'sold').length,
          rentedProperties: properties.filter(p => p.status === 'rented').length
        };
        
        return stats;
      })
    );
    
    res.json({
      success: true,
      data: agentStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agent statistics',
      error: error.message
    });
  }
};

// @desc    Get owner statistics
// @route   GET /api/admin/stats/owners
// @access  Private/Admin
export const getOwnerStats = async (req, res) => {
  try {
    // Get all users who own properties (sellers and agents)
    const owners = await User.find({ 
      role: { $in: ['seller', 'agent'] } 
    }).select('-password');
    
    const ownerStats = await Promise.all(
      owners.map(async (owner) => {
        const properties = await Property.find({ owner: owner._id });
        
        const stats = {
          owner: owner,
          totalProperties: properties.length,
          activeProperties: properties.filter(p => p.status === 'active').length,
          soldProperties: properties.filter(p => p.status === 'sold').length,
          rentedProperties: properties.filter(p => p.status === 'rented').length
        };
        
        return stats;
      })
    );
    
    // Filter out owners with no properties
    const ownersWithProperties = ownerStats.filter(stat => stat.totalProperties > 0);
    
    res.json({
      success: true,
      data: ownersWithProperties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching owner statistics',
      error: error.message
    });
  }
};

// @desc    Get all agents with their properties
// @route   GET /api/admin/agents
// @access  Private/Admin
export const getAllAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('-password');
    
    const agentsWithProperties = await Promise.all(
      agents.map(async (agent) => {
        const properties = await Property.find({ owner: agent._id });
        return {
          ...agent.toObject(),
          properties,
          propertyCount: properties.length
        };
      })
    );
    
    res.json({
      success: true,
      count: agentsWithProperties.length,
      data: agentsWithProperties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching agents',
      error: error.message
    });
  }
};

// @desc    Get all owners with their properties
// @route   GET /api/admin/owners
// @access  Private/Admin
export const getAllOwners = async (req, res) => {
  try {
    const owners = await User.find({ 
      role: { $in: ['seller', 'agent'] } 
    }).select('-password');
    
    const ownersWithProperties = await Promise.all(
      owners.map(async (owner) => {
        const properties = await Property.find({ owner: owner._id });
        return {
          ...owner.toObject(),
          properties,
          propertyCount: properties.length
        };
      })
    );
    
    // Filter out owners with no properties
    const filteredOwners = ownersWithProperties.filter(owner => owner.propertyCount > 0);
    
    res.json({
      success: true,
      count: filteredOwners.length,
      data: filteredOwners
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching owners',
      error: error.message
    });
  }
};

// @desc    Get properties by user ID
// @route   GET /api/admin/properties/:userId
// @access  Private/Admin
export const getPropertiesByUser = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.params.userId })
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// @desc    Get all properties (admin)
// @route   GET /api/admin/properties
// @access  Private/Admin
export const getAllProperties = async (req, res) => {
  try {
    const { status, purpose, propertyType } = req.query;
    
    let query = {};
    
    if (status) query.status = status;
    if (purpose) query.purpose = purpose;
    if (propertyType) query.propertyType = propertyType;
    
    const properties = await Property.find(query)
      .populate('owner', 'name email role')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: properties.length,
      data: properties
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching properties',
      error: error.message
    });
  }
};

// @desc    Update property status
// @route   PATCH /api/admin/properties/:id/status
// @access  Private/Admin
export const updatePropertyStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['active', 'sold', 'rented', 'inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value'
      });
    }
    
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('owner', 'name email role');
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property status updated successfully',
      data: property
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating property status',
      error: error.message
    });
  }
};

// @desc    Delete property
// @route   DELETE /api/admin/properties/:id
// @access  Private/Admin
export const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Property deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting property',
      error: error.message
    });
  }
};

