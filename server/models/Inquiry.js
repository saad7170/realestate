import mongoose from 'mongoose';

const inquirySchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required']
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender reference is required']
  },
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please provide your phone number'],
    trim: true
  },
  message: {
    type: String,
    maxlength: [1000, 'Message cannot be more than 1000 characters'],
    trim: true
  },
  status: {
    type: String,
    enum: ['new', 'contacted', 'closed'],
    default: 'new'
  }
}, {
  timestamps: true
});

// Index for faster queries
inquirySchema.index({ property: 1, sender: 1 });
inquirySchema.index({ status: 1 });
inquirySchema.index({ createdAt: -1 });

export default mongoose.model('Inquiry', inquirySchema);
