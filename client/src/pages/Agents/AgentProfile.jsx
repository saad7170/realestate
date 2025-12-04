import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import agentService from '../../services/agentService';

const AgentProfile = () => {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [propertiesPage, setPropertiesPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchAgentData();
  }, [id]);

  useEffect(() => {
    if (agent) {
      fetchAgentProperties();
    }
  }, [propertiesPage, agent]);

  const fetchAgentData = async () => {
    try {
      setLoading(true);
      const response = await agentService.getAgentProfile(id);
      setAgent(response.data);
      setError('');
    } catch (err) {
      setError(err.message || 'Failed to load agent profile');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentProperties = async () => {
    try {
      const response = await agentService.getAgentProperties(id, {
        page: propertiesPage,
        limit: 9
      });
      setProperties(response.data);
      setTotalPages(response.pages);
    } catch (err) {
      console.error('Failed to load properties:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading agent profile...</p>
        </div>
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Agent not found'}</p>
          <Link to="/agents" className="text-blue-600 hover:underline">
            Back to Agents
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Agent Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              {agent.avatar ? (
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-blue-500"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-blue-500 flex items-center justify-center text-white text-5xl font-bold">
                  {agent.name?.charAt(0)}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{agent.name}</h1>
              
              {agent.agencyName && (
                <p className="text-lg text-gray-600 mb-3">
                  <span className="font-medium">Agency:</span> {agent.agencyName}
                </p>
              )}

              {agent.licenseNumber && (
                <p className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">License:</span> {agent.licenseNumber}
                </p>
              )}

              {agent.experience && (
                <p className="text-sm text-gray-600 mb-3">
                  <span className="font-medium">Experience:</span> {agent.experience} years
                </p>
              )}

              {agent.specialization && agent.specialization.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-2">
                  {agent.specialization.map((spec, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full font-medium"
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {agent.bio && (
                <p className="text-gray-700 mb-4">{agent.bio}</p>
              )}

              {/* Contact Info */}
              <div className="flex flex-wrap gap-4 mt-4">
                {agent.phone && (
                  <a
                    href={`tel:${agent.phone}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {agent.phone}
                  </a>
                )}

                {agent.email && (
                  <a
                    href={`mailto:${agent.email}`}
                    className="flex items-center gap-2 text-gray-700 hover:text-blue-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    {agent.email}
                  </a>
                )}
              </div>
            </div>

            {/* Stats */}
            {agent.stats && (
              <div className="bg-gray-50 rounded-lg p-6 min-w-[200px]">
                <h3 className="font-semibold text-gray-800 mb-4">Statistics</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{agent.stats.totalProperties}</p>
                    <p className="text-sm text-gray-600">Total Properties</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{agent.stats.activeProperties}</p>
                    <p className="text-sm text-gray-600">Active Listings</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-600">{agent.stats.soldProperties}</p>
                    <p className="text-sm text-gray-600">Sold</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Properties Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Properties by {agent.name}
          </h2>

          {properties.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-gray-600">No properties listed yet</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {properties.map((property) => (
                  <Link
                    key={property._id}
                    to={`/properties/${property._id}`}
                    className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    {property.images && property.images.length > 0 ? (
                      <img
                        src={property.images[0]}
                        alt={property.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">
                        {property.title}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 mb-2">
                        PKR {property.price?.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        {property.location?.city}, {property.location?.area}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2">
                  <button
                    onClick={() => setPropertiesPage(p => Math.max(1, p - 1))}
                    disabled={propertiesPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="px-4 py-2 text-gray-700">
                    Page {propertiesPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPropertiesPage(p => Math.min(totalPages, p + 1))}
                    disabled={propertiesPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentProfile;
