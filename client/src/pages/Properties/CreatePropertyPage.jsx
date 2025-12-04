import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { propertyService, uploadService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    purpose: 'buy',
    propertyType: 'home',
    subType: 'house',
    price: '',
    area: {
      value: '',
      unit: 'marla'
    },
    location: {
      city: '',
      area: '',
      address: ''
    },
    features: {
      bedrooms: 0,
      bathrooms: 0,
      parking: 0,
      furnished: false
    },
    images: []
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + selectedFiles.length > 20) {
      setError('Maximum 20 images allowed');
      return;
    }

    // Check file sizes (5MB limit per file)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    const oversizedFiles = files.filter(file => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      setError(`Some files are too large. Maximum size is 5MB per file. Large files: ${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Check file types
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    const invalidFiles = files.filter(file => !allowedTypes.includes(file.type));

    if (invalidFiles.length > 0) {
      setError(`Invalid file type. Only JPEG, PNG and WebP images are allowed. Invalid files: ${invalidFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));

    setSelectedFiles(prev => [...prev, ...files]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
    setError('');
  };

  const removeImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors([]);

    try {
      // Upload images first if any
      let uploadedImageUrls = [];
      if (selectedFiles.length > 0) {
        setUploadingImages(true);
        setUploadProgress(0);
        try {
          const uploadResponse = await uploadService.uploadImages(
            selectedFiles,
            (progress) => setUploadProgress(progress)
          );
          uploadedImageUrls = uploadResponse.data.map(img => img.url);
          setUploadingImages(false);
          setUploadProgress(100);
        } catch (uploadErr) {
          console.error('Image upload error:', uploadErr);
          setError(`Image upload failed: ${uploadErr.message || 'Unknown error'}`);
          setLoading(false);
          setUploadingImages(false);
          setUploadProgress(0);
          return;
        }
      }

      // Create property with uploaded image URLs
      const propertyData = {
        ...formData,
        price: Number(formData.price),
        area: {
          value: Number(formData.area.value),
          unit: formData.area.unit
        },
        features: {
          bedrooms: Number(formData.features.bedrooms),
          bathrooms: Number(formData.features.bathrooms),
          parking: Number(formData.features.parking),
          furnished: Boolean(formData.features.furnished)
        },
        images: uploadedImageUrls
      };

      console.log('Submitting property data:', propertyData);

      const response = await propertyService.createProperty(propertyData);

      if (response.success) {
        navigate(`/properties/${response.data._id}`);
      }
    } catch (err) {
      console.error('Property creation error:', err);

      // Handle validation errors
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
        setError(err.response.data.message || 'Validation failed');
      } else {
        setError(err.message || err.response?.data?.message || 'Failed to create property');
      }

      setLoading(false);
      setUploadingImages(false);
    }
  };

  const subTypeOptions = {
    home: ['house', 'flat', 'penthouse', 'upper-portion', 'lower-portion'],
    plot: ['residential', 'commercial', 'agricultural', 'industrial'],
    commercial: ['office', 'shop', 'warehouse', 'plaza', 'showroom', 'building']
  };

  if (loading || uploadingImages) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
          <LoadingSpinner />
          {uploadingImages && (
            <div className="mt-6">
              <p className="text-gray-700 text-center font-medium mb-3">
                Uploading images... Please wait
              </p>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-primary-600 h-full transition-all duration-300 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="text-gray-600 text-center text-sm mt-2">
                {uploadProgress}% complete
              </p>
            </div>
          )}
          {loading && !uploadingImages && (
            <p className="mt-4 text-gray-600 text-center">Creating property...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Create New Property</h1>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <p className="font-semibold">{error}</p>
            {validationErrors.length > 0 && (
              <ul className="mt-2 list-disc list-inside space-y-1">
                {validationErrors.map((err, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium capitalize">{err.field}:</span> {err.message}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Basic Information</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Beautiful 3 Bedroom House in DHA"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Describe your property in detail..."
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Purpose *
                  </label>
                  <select
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="buy">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <select
                    name="propertyType"
                    value={formData.propertyType}
                    onChange={(e) => {
                      handleInputChange(e);
                      setFormData(prev => ({
                        ...prev,
                        subType: subTypeOptions[e.target.value][0]
                      }));
                    }}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="home">Home</option>
                    <option value="plot">Plot</option>
                    <option value="commercial">Commercial</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sub Type *
                  </label>
                  <select
                    name="subType"
                    value={formData.subType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 capitalize"
                  >
                    {subTypeOptions[formData.propertyType].map(option => (
                      <option key={option} value={option} className="capitalize">
                        {option.replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price (PKR) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 5000000"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Size *
                  </label>
                  <input
                    type="number"
                    name="area.value"
                    value={formData.area.value}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., 5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area Unit *
                  </label>
                  <select
                    name="area.unit"
                    value={formData.area.unit}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="marla">Marla</option>
                    <option value="kanal">Kanal</option>
                    <option value="sq-ft">Square Feet</option>
                    <option value="sq-yard">Square Yard</option>
                    <option value="sq-meter">Square Meter</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Location</h2>

            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <input
                    type="text"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., Lahore"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Area/Locality *
                  </label>
                  <input
                    type="text"
                    name="location.area"
                    value={formData.location.area}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="e.g., DHA Phase 6"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="location.address"
                  value={formData.location.address}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="e.g., Block A, Street 123"
                />
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Features</h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bedrooms
                </label>
                <input
                  type="number"
                  name="features.bedrooms"
                  value={formData.features.bedrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bathrooms
                </label>
                <input
                  type="number"
                  name="features.bathrooms"
                  value={formData.features.bathrooms}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Parking
                </label>
                <input
                  type="number"
                  name="features.parking"
                  value={formData.features.parking}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div className="flex items-center pt-6">
                <input
                  type="checkbox"
                  name="features.furnished"
                  checked={formData.features.furnished}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                />
                <label className="ml-2 text-sm font-medium text-gray-700">
                  Furnished
                </label>
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="border-b pb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Property Images</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images (Max 20)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <div className="mt-2 space-y-1">
                  <p className="text-sm text-gray-700 font-medium">
                    Selected: {selectedFiles.length} image(s)
                  </p>
                  <p className="text-xs text-gray-500">
                    • Max 5MB per image • JPEG, PNG, WebP only • Up to 20 images
                  </p>
                </div>
              </div>

              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Property'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePropertyPage;
