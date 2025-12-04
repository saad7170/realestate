import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService from '../../services/api/adminService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AgentOwnerList = () => {
  const [activeTab, setActiveTab] = useState('agents');
  const [agents, setAgents] = useState([]);
  const [owners, setOwners] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userProperties, setUserProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError('');
      if (activeTab === 'agents') {
        const response = await adminService.getAllAgents();
        setAgents(response.data);
      } else {
        const response = await adminService.getAllOwners();
        setOwners(response.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    setUserProperties(user.properties || []);
  };

  const currentList = activeTab === 'agents' ? agents : owners;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Agents & Owners</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          View all agents and property owners with their listings
        </p>
      </div>

      {error && (
        <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => {
                setActiveTab('agents');
                setSelectedUser(null);
              }}
              className={`${
                activeTab === 'agents'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Agents ({agents.length})
            </button>
            <button
              onClick={() => {
                setActiveTab('owners');
                setSelectedUser(null);
              }}
              className={`${
                activeTab === 'owners'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Owners ({owners.length})
            </button>
          </nav>
        </div>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* User List */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-4 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {activeTab === 'agents' ? 'Agents' : 'Owners'}
                </h2>
              </div>
              <div className="divide-y divide-gray-200 dark:divide-gray-700 max-h-[600px] overflow-y-auto">
                {currentList.length === 0 ? (
                  <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                    No {activeTab} found
                  </div>
                ) : (
                  currentList.map((user) => (
                    <button
                      key={user._id}
                      onClick={() => handleUserClick(user)}
                      className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                        selectedUser?._id === user._id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                            {user.name}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                          {user.agencyName && (
                            <p className="text-xs text-gray-400 mt-1">
                              {user.agencyName}
                            </p>
                          )}
                        </div>
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                            {user.propertyCount || 0} properties
                          </span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="lg:col-span-2">
            {selectedUser ? (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedUser.name}'s Properties
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                    {userProperties.length} total properties
                  </p>
                </div>
                <div className="p-6">
                  {userProperties.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No properties found
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userProperties.map((property) => (
                        <div
                          key={property._id}
                          className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {property.title}
                              </h3>
                              <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                {property.description}
                              </p>
                              <div className="flex items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                                <span className="capitalize">
                                  {property.purpose}
                                </span>
                                <span>•</span>
                                <span className="capitalize">
                                  {property.propertyType}
                                </span>
                                <span>•</span>
                                <span>
                                  {property.location.city}, {property.location.area}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                                  PKR {property.price.toLocaleString()}
                                </span>
                                <span
                                  className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                    property.status === 'active'
                                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                                      : property.status === 'sold'
                                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                                      : property.status === 'rented'
                                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
                                      : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                  }`}
                                >
                                  {property.status}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              {property.images && property.images[0] && (
                                <img
                                  src={property.images[0]}
                                  alt={property.title}
                                  className="w-24 h-24 object-cover rounded-lg"
                                />
                              )}
                            </div>
                          </div>
                          <div className="mt-4 flex gap-2">
                            <Link
                              to={`/properties/${property._id}`}
                              className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                              View Details
                            </Link>
                            <Link
                              to={`/dashboard/properties/edit/${property._id}`}
                              className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700"
                            >
                              Edit Property
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center border border-gray-200 dark:border-gray-700">
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
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  No {activeTab === 'agents' ? 'agent' : 'owner'} selected
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  Select a {activeTab === 'agents' ? 'agent' : 'owner'} from the list to view their properties
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentOwnerList;
