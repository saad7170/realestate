import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold tracking-tight">
              <span className="text-gray-800">7 STAR</span>
              <span className="ml-2 text-gray-600 font-light">ESTATE</span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/properties?propertyType=home" className="text-gray-700 hover:text-gray-900 transition font-medium">
              Homes
            </Link>
            <Link to="/properties?propertyType=plot" className="text-gray-700 hover:text-gray-900 transition font-medium">
              Plots
            </Link>
            <Link to="/properties?propertyType=commercial" className="text-gray-700 hover:text-gray-900 transition font-medium">
              Commercial
            </Link>
            <Link to="/properties" className="text-gray-700 hover:text-gray-900 transition font-medium">
              All Properties
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {/* Show placeholder while loading to prevent layout shift */}
            {loading && (
              <div className="flex items-center space-x-4">
                <div className="w-12 h-6"></div>
                <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              </div>
            )}

            {/* Not logged in - Show Login & Sign Up */}
            {!loading && !isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-gray-900 transition font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition font-medium shadow-md"
                >
                  Sign Up
                </Link>
              </>
            )}

            {/* Logged in as non-admin - Show Dashboard options */}
            {!loading && isAuthenticated && user?.role !== 'admin' && (
              <>
                <Link
                  to="/properties/create"
                  className="bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-800 hover:to-gray-900 text-white px-4 py-2 rounded-lg transition flex items-center space-x-2 shadow-md"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  <span>Add Property</span>
                </Link>
                <Link
                  to="/dashboard"
                  className="text-gray-700 hover:text-gray-900 transition font-medium"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg text-gray-800 transition font-medium"
                >
                  Logout
                </button>
              </>
            )}

            {/* Logged in as admin - Show nothing (admin uses dashboard) */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
