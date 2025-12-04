import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'buyer',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
         style={{
           background: 'linear-gradient(to bottom right, #f5f5f5, #e5e5e5)',
         }}>
      {/* Block Pattern Background - Grey/Black Theme */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-full h-full"
             style={{
               backgroundImage: `
                 repeating-linear-gradient(
                   90deg,
                   transparent,
                   transparent 60px,
                   rgba(0, 0, 0, 0.08) 60px,
                   rgba(0, 0, 0, 0.08) 62px
                 ),
                 repeating-linear-gradient(
                   0deg,
                   transparent,
                   transparent 60px,
                   rgba(0, 0, 0, 0.08) 60px,
                   rgba(0, 0, 0, 0.08) 62px
                 )
               `,
             }}>
        </div>
      </div>

      {/* Floating Blocks Decoration - Grey/Black Theme */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-gray-300/70 rounded-3xl transform rotate-12"
           style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.25), 0 10px 30px rgba(0, 0, 0, 0.15)' }}></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-gray-400/60 rounded-3xl transform -rotate-12"
           style={{ boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 10px 30px rgba(0, 0, 0, 0.2)' }}></div>
      <div className="absolute top-1/3 right-1/4 w-32 h-32 bg-gray-200/80 rounded-3xl transform rotate-45"
           style={{ boxShadow: '0 15px 45px rgba(0, 0, 0, 0.2)' }}></div>
      <div className="absolute bottom-1/3 left-1/4 w-28 h-28 bg-gray-500/50 rounded-3xl transform -rotate-45"
           style={{ boxShadow: '0 15px 45px rgba(0, 0, 0, 0.25)' }}></div>

      <div className="max-w-md w-full relative z-10">
        {/* Enhanced Card with Block Shadows - More Visible */}
        <div className="bg-white rounded-3xl p-10 transform transition-all duration-300 hover:scale-[1.02]"
             style={{
               boxShadow: `
                 0 30px 80px rgba(0, 0, 0, 0.25),
                 0 15px 40px rgba(0, 0, 0, 0.18),
                 0 8px 20px rgba(0, 0, 0, 0.12),
                 inset 0 2px 0 rgba(255, 255, 255, 0.9)
               `,
             }}>

          {/* Logo/Brand Section with Block Effect - Grey/Black Theme */}
          <div className="text-center mb-8 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-24 h-2 bg-gradient-to-r from-gray-700 via-gray-800 to-black rounded-full"
                 style={{ boxShadow: '0 6px 20px rgba(0, 0, 0, 0.6)' }}></div>
            <h2 className="text-3xl font-bold text-gray-800 mt-4"
                style={{ textShadow: '0 3px 6px rgba(0, 0, 0, 0.15)' }}>
              Create Account
            </h2>
            <p className="text-gray-600 text-sm mt-2 font-medium">Join 7 star estate community</p>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg mb-4"
                 style={{ boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-400"
                placeholder="John Doe"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.05)' }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-400"
                placeholder="your@email.com"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.05)' }}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-400"
                placeholder="+92 300 1234567"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.05)' }}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-400"
                placeholder="Enter your password"
                minLength="6"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.05)' }}
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-sm font-bold text-gray-700 mb-2">
                I am a
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-5 py-3 border-2 border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-700 focus:border-gray-700 transition-all duration-300 bg-gray-50 hover:bg-white hover:border-gray-400"
                style={{ boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08), inset 0 1px 2px rgba(0, 0, 0, 0.05)' }}
              >
                <option value="buyer">Buyer</option>
                <option value="seller">Seller/Owner</option>
                <option value="agent">Real Estate Agent</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-gray-800 to-black hover:from-gray-900 hover:to-gray-950 text-white font-bold py-4 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.4), 0 6px 20px rgba(0, 0, 0, 0.3), 0 3px 10px rgba(0, 0, 0, 0.2)',
              }}
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-gray-800 hover:text-black font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>

        {/* Additional Block Shadow Effect Below Card - Grey/Black Theme */}
        <div className="mt-6 h-3 bg-gradient-to-r from-transparent via-gray-600/40 to-transparent rounded-full blur-md"
             style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)' }}></div>
      </div>
    </div>
  );
};

export default RegisterPage;
