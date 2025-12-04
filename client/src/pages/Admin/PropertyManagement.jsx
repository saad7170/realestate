import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import adminService from '../../services/api/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PropertyManagement = () => {
  const [searchParams] = useSearchParams();
  const [properties, setProperties] = useState([]);
  const [filteredProperties, setFilteredProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: searchParams.get('status') || '',
    purpose: '',
    propertyType: '',
    search: ''
  });

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    // Update filters when URL params change
    const statusParam = searchParams.get('status');
    if (statusParam && statusParam !== filters.status) {
      setFilters(prev => ({ ...prev, status: statusParam }));
    }
  }, [searchParams]);

  useEffect(() => {
    applyFilters();
  }, [filters, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllProperties();
      setProperties(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch properties');
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...properties];

    if (filters.status) {
      filtered = filtered.filter((property) => property.status === filters.status);
    }

    if (filters.purpose) {
      filtered = filtered.filter((property) => property.purpose === filters.purpose);
    }

    if (filters.propertyType) {
      filtered = filtered.filter((property) => property.propertyType === filters.propertyType);
    }

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (property) =>
          property.title.toLowerCase().includes(searchLower) ||
          property.location.city.toLowerCase().includes(searchLower) ||
          property.location.area.toLowerCase().includes(searchLower)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleUnlistProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to unlist this property?')) {
      try {
        await adminService.updatePropertyStatus(propertyId, 'inactive');
        await fetchProperties();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to unlist property');
      }
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    if (
      window.confirm(
        'Are you sure you want to delete this property? This action cannot be undone.'
      )
    ) {
      try {
        await adminService.deleteProperty(propertyId);
        await fetchProperties();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete property');
      }
    }
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      sold: 'bg-yellow-100 text-yellow-800',
      rented: 'bg-blue-100 text-blue-800',
      inactive: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || colors.inactive;
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Property Management</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          View and manage all properties on the platform
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Search
            </label>
            <input
              type="text"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              placeholder="Search by title or location..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Purpose
            </label>
            <select
              name="purpose"
              value={filters.purpose}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Purpose</option>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Type
            </label>
            <select
              name="propertyType"
              value={filters.propertyType}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="home">Home</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          Showing {filteredProperties.length} of {properties.length} properties
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map((property) => (
          <div
            key={property._id}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-700"
          >
            {/* Property Image */}
            <div className="relative h-48 bg-gray-200">
              {property.images && property.images[0] ? (
                <img
                  src={property.images[0]}
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 dark:text-gray-500 bg-gray-200 dark:bg-gray-700">
                  <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(
                    property.status
                  )}`}
                >
                  {property.status}
                </span>
              </div>
            </div>

            {/* Property Details */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-1">
                {property.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                {property.description}
              </p>
              
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {property.location.city}, {property.location.area}
              </div>

              <div className="flex items-center justify-between mb-3">
                <span className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  PKR {property.price.toLocaleString()}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {property.purpose}
                </span>
              </div>

              {property.owner && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                  Owner: {property.owner.name} ({property.owner.role})
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Link
                  to={`/properties/${property._id}`}
                  className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 text-center"
                >
                  View
                </Link>
                {property.status === 'active' && (
                  <button
                    onClick={() => handleUnlistProperty(property._id)}
                    className="flex-1 px-3 py-2 text-sm bg-yellow-600 text-white rounded hover:bg-yellow-700"
                  >
                    Unlist
                  </button>
                )}
                <button
                  onClick={() => handleDeleteProperty(property._id)}
                  className="px-3 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No properties found</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Try adjusting your filters to see more results
          </p>
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
