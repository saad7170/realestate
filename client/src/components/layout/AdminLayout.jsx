import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import UserProfileSidebar from '../admin/UserProfileSidebar';
import { useTheme } from '../../contexts/ThemeContext';

const AdminLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [profileSidebarOpen, setProfileSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white dark:bg-gray-800 border-r-2 border-gray-300 dark:border-gray-700 transition-all duration-300 flex flex-col h-full`}>
        {/* Logo */}
        <div className={`${sidebarCollapsed ? 'px-3' : 'px-6'} py-4 h-[73px] flex items-center justify-between border-b-2 border-gray-300 dark:border-gray-700`}>
          <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : 'space-x-3'}`}>
            {!sidebarCollapsed && (
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">A</span>
              </div>
            )}
            {!sidebarCollapsed && <span className="text-xl font-bold text-gray-900 dark:text-white">Admin</span>}
            {sidebarCollapsed && (
              <button
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            )}
          </div>
          {!sidebarCollapsed && (
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className={`flex-1 ${sidebarCollapsed ? 'px-2' : 'p-4'} py-4 space-y-2`}>
          <div className="mb-6">
            {!sidebarCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-3">Main</p>}
            <Link
              to="/admin"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg ${
                isActive('/admin')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Dashboard' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              {!sidebarCollapsed && <span className="font-medium">Dashboard</span>}
            </Link>
            <Link
              to="/admin/users"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg ${
                isActive('/admin/users')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Users' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              {!sidebarCollapsed && <span className="font-medium">Users</span>}
            </Link>
            <Link
              to="/admin/properties"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg ${
                isActive('/admin/properties')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Properties' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {!sidebarCollapsed && <span className="font-medium">Properties</span>}
            </Link>
            <Link
              to="/admin/statistics"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg ${
                isActive('/admin/statistics')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Reports' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              {!sidebarCollapsed && <span className="font-medium">Reports</span>}
            </Link>
          </div>

          <div>
            {!sidebarCollapsed && <p className="text-xs font-semibold text-gray-400 uppercase mb-2 px-3">Records</p>}
            <Link
              to="/admin/agents-owners"
              className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg ${
                isActive('/admin/agents-owners')
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
              }`}
              title={sidebarCollapsed ? 'Agents & Owners' : ''}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {!sidebarCollapsed && <span className="font-medium">Agents & Owners</span>}
            </Link>
          </div>
        </nav>

        {/* Settings */}
        <div className={`${sidebarCollapsed ? 'px-2' : 'p-4'} py-4 border-t-2 border-gray-300 dark:border-gray-700`}>
          <button
            className={`flex items-center ${sidebarCollapsed ? 'justify-center' : 'space-x-3'} px-3 py-2.5 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 w-full`}
            title={sidebarCollapsed ? 'Settings' : ''}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {!sidebarCollapsed && <span className="font-medium">Settings</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white dark:bg-gray-800 border-b-2 border-gray-300 dark:border-gray-700 shadow-sm h-[73px] flex items-center relative transition-colors duration-300">
          <div className="flex items-center justify-between px-6 w-full h-full">
            {/* Left Section - Logo and Page Title */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-xl">P</span>
                </div>
                <span className="text-gray-900 dark:text-white text-xl font-bold tracking-wide hidden md:block">7 star estate</span>
              </div>
              <div className="hidden lg:block border-l-2 border-gray-300 dark:border-gray-600 pl-6">
                <span className="text-gray-600 dark:text-gray-300 text-base">Admin Dashboard</span>
              </div>
            </div>

            {/* Right Section - Controls and User Info */}
            <div className="flex items-center space-x-3">
              {/* Messages Icon */}
              <button className="p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative">
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </button>

              {/* Date and Time Card */}
              <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden shadow-sm border-2 border-gray-300 dark:border-gray-600 h-[57px]">
                {/* Date Section */}
                <div className="px-3 py-1.5 bg-gray-200 dark:bg-gray-600 text-center border-r-2 border-gray-300 dark:border-gray-500 h-full flex flex-col justify-center">
                  <p className="text-[10px] text-gray-600 dark:text-gray-300 uppercase tracking-wider font-medium leading-tight">
                    {new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white leading-tight">
                    {new Date().getDate()}
                  </p>
                </div>
                {/* Time and User Section */}
                <div className="px-3 py-1.5 flex flex-col justify-center h-full">
                  <p className="text-sm font-bold text-gray-900 dark:text-white leading-tight">
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                  <p className="text-[10px] text-gray-600 dark:text-gray-300 uppercase tracking-wide leading-tight">
                    {user?.name?.split(' ')[0] || 'Admin'}
                  </p>
                </div>
              </div>

              {/* User Profile Button */}
              <button
                onClick={() => setProfileSidebarOpen(true)}
                className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-105"
              >
                {user?.name?.charAt(0).toUpperCase() || 'A'}
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </main>

      {/* User Profile Sidebar */}
      <UserProfileSidebar
        isOpen={profileSidebarOpen}
        onClose={() => setProfileSidebarOpen(false)}
        user={user}
      />
    </div>
  );
};


export default AdminLayout;
