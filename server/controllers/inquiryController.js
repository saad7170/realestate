import Inquiry from '../models/Inquiry.js';
import Property from '../models/Property.js';

// @desc    Submit new inquiry
// @route   POST /api/inquiries
// @access  Private
export const createInquiry = async (req, res) => {
  try {
    const { property, name, email, phone, message } = req.body;

    // Check if property exists
    const propertyExists = await Property.findById(property);
    if (!propertyExists) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    // Check if user is trying to inquire about their own property
    if (propertyExists.owner.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'You cannot inquire about your own property'
      });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      property,
      sender: req.user._id,
      name,
      email,
      phone,
      message
    });

    // Populate property and sender details
    await inquiry.populate('property', 'title price location');
    await inquiry.populate('sender', 'name email');

    res.status(201).json({
      success: true,
      message: 'Inquiry submitted successfully',
      data: inquiry
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error submitting inquiry',
      error: error.message
    });
  }
};

// @desc    Get inquiries for a specific property (property owner only)
// @route   GET /api/inquiries/property/:propertyId
// @access  Private
export const getPropertyInquiries = async (req, res) => {
  try {
    const { propertyId } = req.params;

    // Check if property exists and user is the owner
    const property = await Property.findById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these inquiries'
      });
    }

    // Get inquiries
    const inquiries = await Inquiry.find({ property: propertyId })
      .populate('sender', 'name email phone')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching inquiries',
      error: error.message
    });
  }
};

// @desc    Get user's sent inquiries
// @route   GET /api/inquiries/sent
// @access  Private
export const getSentInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ sender: req.user._id })
      .populate('property', 'title price location images')
      .populate('property.owner', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching sent inquiries',
      error: error.message
    });
  }
};

// @desc    Get all inquiries received by user (for their properties)
// @route   GET /api/inquiries/received
// @access  Private
export const getReceivedInquiries = async (req, res) => {
  try {
    // Get all properties owned by the user
    const userProperties = await Property.find({ owner: req.user._id }).select('_id');
    const propertyIds = userProperties.map(prop => prop._id);

    // Get inquiries for those properties
    const inquiries = await Inquiry.find({ property: { $in: propertyIds } })
      .populate('property', 'title price location images')
      .populate('sender', 'name phone email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: inquiries.length,
      data: inquiries
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error fetching received inquiries',
      error: error.message
    });
  }
};

// @desc    Update inquiry status (property owner only)
// @route   PUT /api/inquiries/:id
// @access  Private
export const updateInquiryStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const inquiry = await Inquiry.findById(req.params.id).populate('property');

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Check if user is property owner
    if (inquiry.property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry'
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Inquiry status updated successfully',
      data: inquiry
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error updating inquiry',
      error: error.message
    });
  }
};

// @desc    Delete inquiry
// @route   DELETE /api/inquiries/:id
// @access  Private
export const deleteInquiry = async (req, res) => {
  try {
    const inquiry = await Inquiry.findById(req.params.id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    // Only sender or admin can delete
    if (inquiry.sender.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this inquiry'
      });
    }

    await inquiry.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Inquiry deleted successfully'
    });

  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error deleting inquiry',
      error: error.message
    });
  }
};
