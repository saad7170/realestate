import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  purpose: {
    type: String,
    required: [true, 'Please specify if property is for buy or rent'],
    enum: ['buy', 'rent']
  },
  propertyType: {
    type: String,
    required: [true, 'Please specify property type'],
    enum: ['home', 'plot', 'commercial']
  },
  subType: {
    type: String,
    required: [true, 'Please specify property sub-type'],
    trim: true
    // Examples: house, flat, upper-portion, lower-portion, farm-house, room, penthouse
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  area: {
    value: {
      type: Number,
      required: [true, 'Please provide area value'],
      min: [0, 'Area cannot be negative']
    },
    unit: {
      type: String,
      required: true,
      enum: ['marla', 'kanal', 'sq-ft', 'sq-yard', 'sq-meter'],
      default: 'marla'
    }
  },
  location: {
    city: {
      type: String,
      required: [true, 'Please provide a city'],
      trim: true
    },
    area: {
      type: String,
      required: [true, 'Please provide an area'],
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    coordinates: {
      lat: {
        type: Number,
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      lng: {
        type: Number,
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    }
  },
  features: {
    bedrooms: {
      type: Number,
      min: [0, 'Bedrooms cannot be negative'],
      default: 0
    },
    bathrooms: {
      type: Number,
      min: [0, 'Bathrooms cannot be negative'],
      default: 0
    },
    parking: {
      type: Number,
      min: [0, 'Parking spaces cannot be negative'],
      default: 0
    },
    furnished: {
      type: Boolean,
      default: false
    }
  },
  images: {
    type: [String],
    validate: {
      validator: function(v) {
        return v.length <= 20;
      },
      message: 'Cannot upload more than 20 images'
    },
    default: []
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'sold', 'rented', 'inactive'],
    default: 'active'
  },
  featured: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for faster queries
propertySchema.index({ purpose: 1, propertyType: 1, 'location.city': 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ createdAt: -1 });

// Virtual for time since posted
propertySchema.virtual('postedAgo').get(function() {
  const now = new Date();
  const diff = now - this.createdAt;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
});

export default mongoose.model('Property', propertySchema);
