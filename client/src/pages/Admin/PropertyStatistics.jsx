import { useState, useEffect } from 'react';
import adminService from '../../services/api/adminService';
import StatsCard from '../../components/admin/StatsCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const PropertyStatistics = () => {
  const [propertyStats, setPropertyStats] = useState(null);
  const [agentStats, setAgentStats] = useState([]);
  const [ownerStats, setOwnerStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeView, setActiveView] = useState('overview');

  useEffect(() => {
    fetchAllStats();
  }, []);

  const fetchAllStats = async () => {
    try {
      setLoading(true);
      const [propStats, agStats, ownStats] = await Promise.all([
        adminService.getPropertyStats(),
        adminService.getAgentStats(),
        adminService.getOwnerStats()
      ]);
      setPropertyStats(propStats.data);
      setAgentStats(agStats.data);
      setOwnerStats(ownStats.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  const statusData = propertyStats?.byStatus || [];
  const typeData = propertyStats?.byType || [];
  const purposeData = propertyStats?.byPurpose || [];
  const cityData = propertyStats?.byCity || [];

  const totalProperties = statusData.reduce((sum, item) => sum + item.count, 0);
  const soldCount = statusData.find(s => s._id === 'sold')?.count || 0;
  const unsoldCount = totalProperties - soldCount;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Property Statistics</h1>
        <p className="text-gray-600 dark:text-gray-300 mt-2">
          Detailed analytics and insights about properties
        </p>
      </div>

      {/* View Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveView('overview')}
              className={`${
                activeView === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveView('agents')}
              className={`${
                activeView === 'agents'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              By Agent
            </button>
            <button
              onClick={() => setActiveView('owners')}
              className={`${
                activeView === 'owners'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              By Owner
            </button>
          </nav>
        </div>
      </div>

      {/* Overview Tab */}
      {activeView === 'overview' && (
        <div className="space-y-8">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Total Properties"
              value={totalProperties}
              color="blue"
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              }
            />
            <StatsCard
              title="Sold Properties"
              value={soldCount}
              color="green"
              subtitle={`${totalProperties > 0 ? ((soldCount / totalProperties) * 100).toFixed(1) : 0}% of total`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
            <StatsCard
              title="Unsold Properties"
              value={unsoldCount}
              color="orange"
              subtitle={`${totalProperties > 0 ? ((unsoldCount / totalProperties) * 100).toFixed(1) : 0}% of total`}
              icon={
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
            />
          </div>

          {/* By Status */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Properties by Status</h2>
            <div className="space-y-3">
              {statusData.map((item) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="capitalize text-gray-700 dark:text-gray-300 font-medium w-24">
                      {item._id}
                    </span>
                    <div className="ml-4 flex-1">
                      <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-4 w-64">
                        <div
                          className={`h-4 rounded-full ${
                            item._id === 'active' ? 'bg-green-500' :
                            item._id === 'sold' ? 'bg-yellow-500' :
                            item._id === 'rented' ? 'bg-blue-500' :
                            'bg-gray-500'
                          }`}
                          style={{ width: `${(item.count / totalProperties) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <span className="ml-4 text-gray-900 dark:text-white font-semibold">
                    {item.count} ({((item.count / totalProperties) * 100).toFixed(1)}%)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* By Type and Purpose */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">By Property Type</h2>
              <div className="space-y-3">
                {typeData.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">By Purpose</h2>
              <div className="space-y-3">
                {purposeData.map((item) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <span className="capitalize text-gray-700 dark:text-gray-300">{item._id}</span>
                    <span className="text-gray-900 dark:text-white font-semibold">{item.count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Cities */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Cities</h2>
            <div className="space-y-3">
              {cityData.map((item, index) => (
                <div key={item._id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-gray-500 dark:text-gray-400 font-medium w-8">#{index + 1}</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">{item._id}</span>
                  </div>
                  <span className="text-gray-900 dark:text-white font-semibold">{item.count} properties</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Agents Tab */}
      {activeView === 'agents' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Agent Statistics</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Property breakdown by agent
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Agent
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rented
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {agentStats.map((stat) => (
                  <tr key={stat.agent._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.agent.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stat.agent.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      {stat.totalProperties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {stat.activeProperties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {stat.soldProperties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {stat.rentedProperties}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {agentStats.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No agent statistics available
              </div>
            )}
          </div>
        </div>
      )}

      {/* Owners Tab */}
      {activeView === 'owners' && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-6 bg-gray-50 dark:bg-gray-700/50 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Owner Statistics</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
              Property breakdown by owner
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Owner
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Rented
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {ownerStats.map((stat) => (
                  <tr key={stat.owner._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {stat.owner.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{stat.owner.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                        {stat.owner.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white font-semibold">
                      {stat.totalProperties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                      {stat.activeProperties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">
                      {stat.soldProperties}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                      {stat.rentedProperties}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {ownerStats.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No owner statistics available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyStatistics;
