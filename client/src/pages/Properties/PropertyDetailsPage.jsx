import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useProperty } from '../../hooks/useProperties';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import AgentCard from '../../components/property/AgentCard';
import ContactAgentModal from '../../components/property/ContactAgentModal';
import PropertyMap from '../../components/property/PropertyMap';

const PropertyDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { property, loading, error } = useProperty(id);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  useEffect(() => {
    // Reset selected image when property changes
    setSelectedImage(0);
  }, [id]);

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
        <button
          onClick={() => navigate('/properties')}
          className="mt-4 text-primary-600 hover:text-primary-700 font-medium"
        >
          &larr; Back to Properties
        </button>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-4">Property not found</p>
          <button
            onClick={() => navigate('/properties')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            &larr; Back to Properties
          </button>
        </div>
      </div>
    );
  }

  const images = property.images && property.images.length > 0
    ? property.images
    : ['https://via.placeholder.com/800x600?text=No+Image'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Link to="/" className="hover:text-primary-600">Home</Link>
            <span>/</span>
            <Link to="/properties" className="hover:text-primary-600">Properties</Link>
            <span>/</span>
            <span className="text-gray-900 font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Main Image */}
              <div className="relative h-96 bg-gray-200">
                <img
                  src={images[selectedImage]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                  }}
                />

                {/* Image Counter */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-3 py-1 rounded-full text-sm">
                    {selectedImage + 1} / {images.length}
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {images.length > 1 && (
                <div className="p-4 bg-gray-50">
                  <div className="flex space-x-2 overflow-x-auto">
                    {images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition ${
                          selectedImage === index
                            ? 'border-primary-600'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/100?text=N/A';
                          }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {property.title}
                  </h1>
                  <p className="text-gray-600 flex items-center">
                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {property.location?.area}, {property.location?.city}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">
                    PKR {property.price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {property.purpose === 'rent' ? 'per month' : ''}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full font-medium">
                  {property.propertyType}
                </span>
                <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium">
                  For {property.purpose === 'buy' ? 'Sale' : 'Rent'}
                </span>
                <span className="inline-block bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full font-medium">
                  {property.subType}
                </span>
                {property.status && property.status !== 'active' && (
                  <span className="inline-block bg-red-100 text-red-800 text-sm px-3 py-1 rounded-full font-medium uppercase">
                    {property.status}
                  </span>
                )}
              </div>

              {/* Key Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 border-t border-b">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {property.area?.value}
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {property.area?.unit}
                  </div>
                </div>
                {property.features?.bedrooms > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {property.features.bedrooms}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Bedrooms</div>
                  </div>
                )}
                {property.features?.bathrooms > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {property.features.bathrooms}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Bathrooms</div>
                  </div>
                )}
                {property.features?.parking > 0 && (
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      {property.features.parking}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">Parking</div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mt-6">
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  Description
                </h2>
                <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                  {property.description}
                </p>
              </div>

              {/* Features & Amenities */}
              {property.features && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Features & Amenities
                  </h2>
                  <div className="grid grid-cols-2 gap-3">
                    {property.features.furnished && (
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Furnished
                      </div>
                    )}
                    {property.features.bedrooms > 0 && (
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {property.features.bedrooms} Bedroom{property.features.bedrooms > 1 ? 's' : ''}
                      </div>
                    )}
                    {property.features.bathrooms > 0 && (
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {property.features.bathrooms} Bathroom{property.features.bathrooms > 1 ? 's' : ''}
                      </div>
                    )}
                    {property.features.parking > 0 && (
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        {property.features.parking} Parking Space{property.features.parking > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Location Details */}
              {property.location?.address && (
                <div className="mt-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3">
                    Location
                  </h2>
                  <p className="text-gray-700">
                    {property.location.address}
                  </p>
                  <p className="text-gray-600 mt-1">
                    {property.location.area}, {property.location.city}
                  </p>
                </div>
              )}

              {/* Google Map */}
              {property.location && (
                <PropertyMap location={property.location} />
              )}
            </div>
          </div>

          {/* Sidebar - Right Side */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 space-y-6">
              {/* Owner/Agent Card */}
              {property.owner && (
                <AgentCard
                  agent={property.owner}
                  property={property}
                  onContactClick={() => setIsContactModalOpen(true)}
                />
              )}

              {/* Property Info Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Property Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Property ID:</span>
                    <span className="font-medium text-gray-900">#{property._id?.slice(-6).toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium text-gray-900 capitalize">{property.propertyType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-gray-900 capitalize">{property.status || 'Active'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Purpose:</span>
                    <span className="font-medium text-gray-900 capitalize">{property.purpose}</span>
                  </div>
                  {property.postedAgo && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted:</span>
                      <span className="font-medium text-gray-900">{property.postedAgo}</span>
                    </div>
                  )}
                  {property.views > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Views:</span>
                      <span className="font-medium text-gray-900">{property.views}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Share Card */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Share Property
                </h3>
                <div className="flex space-x-3">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </button>
                  <button className="flex-1 bg-blue-400 hover:bg-blue-500 text-white p-2 rounded-lg transition">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                  </button>
                  <button className="flex-1 bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition">
                    <svg className="w-5 h-5 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-6h2v6zm-1-6.891c-.607 0-1.1-.496-1.1-1.109 0-.612.492-1.109 1.1-1.109s1.1.497 1.1 1.109c0 .613-.493 1.109-1.1 1.109zm8 6.891h-1.998v-2.861c0-1.881-2.002-1.722-2.002 0v2.861h-2v-6h2v1.093c.872-1.616 4-1.736 4 1.548v3.359z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Agent Modal */}
      <ContactAgentModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        agent={property?.owner}
        property={property}
      />
    </div>
  );
};

export default PropertyDetailsPage;
