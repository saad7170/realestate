const Notifications = () => {
  const notifications = [
    { id: 1, title: 'New property listed', message: 'A new property was added to the system', time: '5 min ago', unread: true },
    { id: 2, title: 'User verification pending', message: '3 users waiting for verification', time: '1 hour ago', unread: true },
    { id: 3, title: 'System update', message: 'System maintenance scheduled for tonight', time: '3 hours ago', unread: false },
    { id: 4, title: 'New message', message: 'You have a new message from support', time: '1 day ago', unread: false },
  ];

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <button className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium">
          Mark all as read
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${notification.unread ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{notification.title}</h3>
                    {notification.unread && (
                      <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full"></span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 mt-1">{notification.message}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{notification.time}</p>
                </div>
                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
