const Security = () => {
  return (
    <div className="max-w-4xl">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Security Settings</h1>

      <div className="space-y-6">
        {/* Two-Factor Authentication */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Two-Factor Authentication</h3>
              <p className="text-gray-600 dark:text-gray-300">Add an extra layer of security to your account</p>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Enable
            </button>
          </div>
        </div>

        {/* Active Sessions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Active Sessions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">Windows - Chrome</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Pakistan • Current Session</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full text-xs font-semibold">Active</span>
            </div>
          </div>
        </div>

        {/* Login History */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Login History</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-gray-900 dark:text-white">Nov 28, 2025 at 04:34 PM</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pakistan • Chrome on Windows</p>
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm">✓ Successful</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-gray-900 dark:text-white">Nov 27, 2025 at 09:15 AM</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">Pakistan • Chrome on Windows</p>
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm">✓ Successful</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Security;
