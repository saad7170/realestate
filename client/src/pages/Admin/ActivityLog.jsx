const ActivityLog = () => {
  const activities = [
    { id: 1, action: 'Logged in', time: '2 hours ago', icon: '🔐' },
    { id: 2, action: 'Updated user profile', time: '5 hours ago', icon: '✏️' },
    { id: 3, action: 'Deleted property listing', time: '1 day ago', icon: '🗑️' },
    { id: 4, action: 'Created new user', time: '2 days ago', icon: '👤' },
    { id: 5, action: 'Changed password', time: '3 days ago', icon: '🔑' },
  ];

  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Activity Log</h1>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{activity.icon}</span>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{activity.action}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</p>
                  </div>
                </div>
                <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
                  View Details
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;
