import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { propertyService, uploadService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditPropertyPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchingProperty, setFetchingProperty] = useState(true);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

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

  useEffect(() => {
    fetchProperty();
  }, [id]);

  const fetchProperty = async () => {
    try {
      setFetchingProperty(true);
      const response = await propertyService.getProperty(id);
      const property = response.data;

      setFormData({
        title: property.title,
        description: property.description,
        purpose: property.purpose,
        propertyType: property.propertyType,
        subType: property.subType,
        price: property.price,
        area: property.area,
        location: property.location,
        features: property.features,
        images: property.images || []
      });

      setExistingImages(property.images || []);
      setError('');
    } catch (err) {
      console.error('Error fetching property:', err);
      setError(err.message || 'Failed to fetch property');
    } finally {
      setFetchingProperty(false);
    }
  };

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

    if (files.length + selectedFiles.length + existingImages.length > 20) {
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

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setPreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setValidationErrors([]);

    try {
      // Upload new images if any
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

      // Combine existing images with newly uploaded images
      const allImages = [...existingImages, ...uploadedImageUrls];

      // Update property with all image URLs
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
        images: allImages
      };

      console.log('Updating property data:', propertyData);

      const response = await propertyService.updateProperty(id, propertyData);

      if (response.success) {
        navigate(`/properties/${response.data._id}`);
      }
    } catch (err) {
      console.error('Property update error:', err);

      // Handle validation errors
      if (err.response?.data?.errors) {
        setValidationErrors(err.response.data.errors);
        setError(err.response.data.message || 'Validation failed');
      } else {
        setError(err.message || err.response?.data?.message || 'Failed to update property');
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

  if (fetchingProperty) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <LoadingSpinner />
        <p className="text-center text-gray-600 mt-4">Loading property details...</p>
      </div>
    );
  }

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
            <p className="mt-4 text-gray-600 text-center">Updating property...</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Edit Property</h1>

      {error && (
        <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          {validationErrors.length > 0 && (
            <ul className="list-disc list-inside mt-2">
              {validationErrors.map((err, index) => (
                <li key={index}>{err.field}: {err.message}</li>
              ))}
            </ul>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Property Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="4"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Purpose *
              </label>
              <select
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="buy">For Sale</option>
                <option value="rent">For Rent</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Property Type *
              </label>
              <select
                name="propertyType"
                value={formData.propertyType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                <option value="home">Home</option>
                <option value="plot">Plot</option>
                <option value="commercial">Commercial</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Sub Type *
              </label>
              <select
                name="subType"
                value={formData.subType}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              >
                {subTypeOptions[formData.propertyType].map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price & Area */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Price & Area</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Price (PKR) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Area *
                </label>
                <input
                  type="number"
                  name="area.value"
                  value={formData.area.value}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Unit *
                </label>
                <select
                  name="area.unit"
                  value={formData.area.unit}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required
                >
                  <option value="marla">Marla</option>
                  <option value="kanal">Kanal</option>
                  <option value="sqft">Sq.Ft</option>
                  <option value="sqm">Sq.M</option>
                  <option value="sqyd">Sq.Yd</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Location</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                City *
              </label>
              <input
                type="text"
                name="location.city"
                value={formData.location.city}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Area/Locality *
              </label>
              <input
                type="text"
                name="location.area"
                value={formData.location.area}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Address
            </label>
            <input
              type="text"
              name="location.address"
              value={formData.location.address}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Features */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Bedrooms
              </label>
              <input
                type="number"
                name="features.bedrooms"
                value={formData.features.bedrooms}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Bathrooms
              </label>
              <input
                type="number"
                name="features.bathrooms"
                value={formData.features.bathrooms}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-2">
                Parking Spaces
              </label>
              <input
                type="number"
                name="features.parking"
                value={formData.features.parking}
                onChange={handleInputChange}
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="features.furnished"
                checked={formData.features.furnished}
                onChange={handleInputChange}
                className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
              />
              <span className="ml-2 text-gray-700">Furnished</span>
            </label>
          </div>
        </div>

        {/* Images */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Images</h2>

          {/* Existing Images */}
          {existingImages.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {existingImages.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Property ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Images Preview */}
          {previewUrls.length > 0 && (
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                New Images to Upload
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {previewUrls.map((url, index) => (
                  <div key={index} className="relative">
                    <img
                      src={url}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload New Images */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              Add More Images (Max 20 total, 5MB per file)
            </label>
            <input
              type="file"
              onChange={handleFileSelect}
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <p className="text-sm text-gray-600 mt-2">
              Total images: {existingImages.length + selectedFiles.length} / 20
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="flex-1 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            disabled={loading || uploadingImages}
          >
            Update Property
          </button>
          <button
            type="button"
            onClick={() => navigate(`/properties/${id}`)}
            className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditPropertyPage;
