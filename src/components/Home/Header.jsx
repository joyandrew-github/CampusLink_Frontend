import React from 'react';
import { Menu, X } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import

// Authentication hook to verify token and extract user data
const useAuth = () => {
  const token = localStorage.getItem('token'); // Retrieve token from localStorage
  let user = null;
  let isAuthenticated = false;

  if (token) {
    try {
      // Decode the token to get user data
      const decoded = jwtDecode(token); // Use jwtDecode named import
      user = { id: decoded.id, role: decoded.role };
      isAuthenticated = true;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token'); // Remove invalid token
    }
  }

  return { user, isAuthenticated };
};

const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleAnnouncementsClick = (e) => {
    if (!isAuthenticated) {
      e.preventDefault();
      navigate('/login');
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear token
    navigate('/login'); // Redirect to login
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img src="https://res.cloudinary.com/duwvhcha4/image/upload/v1753507942/logosece_pj0sr9.png" alt="CampusLink Logo" className="h-18 w-15" />
            <div>
              <h1 className="text-xl font-bold text-gray-900">CampusLink</h1>
              <p className="text-xs text-gray-600">Sri Eshwar College of Engineering</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Home</Link>
            <Link to="#features" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">Features</Link>
            <Link
              to="/announcements"
              onClick={handleAnnouncementsClick}
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Announcements
            </Link>
            {isAuthenticated && (
              <Link
                to={user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
            )}
            {!isAuthenticated && (
                
                  <Link to="/login">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl font-medium">
                      Login
                    </button>
                  </Link>
                )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">Home</Link>
              <Link to="#features" className="text-gray-700 hover:text-blue-600 font-medium">Features</Link>
              <Link
                to="/announcements"
                onClick={handleAnnouncementsClick}
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                Announcements
              </Link>
              {isAuthenticated && (
                <Link
                  to={user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard'}
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Dashboard
                </Link>
              )}
              <div className="flex flex-col space-y-2 pt-4 border-t border-gray-200">
                {!isAuthenticated && (
                
                  <Link to="/login">
                    <button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-2 rounded-xl font-medium">
                      Login
                    </button>
                  </Link>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;