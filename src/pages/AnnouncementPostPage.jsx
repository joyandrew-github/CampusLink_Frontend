import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, MapPin, Clock, Users, BookOpen, AlertCircle, Trophy, Coffee, Filter, Search, Eye } from 'lucide-react';
import { formatDistanceToNow, startOfWeek, endOfWeek } from 'date-fns';

// Helper function to decode JWT token (client-side)
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const AnnouncementPostPage = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.warn('No authentication token found, using empty announcements');
        setLoading(false);
        return;
      }

      const decodedToken = decodeToken(token);
      console.log('Announcements - Decoded token:', decodedToken);

      try {
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/announcements', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        console.log('API Response - Announcements:', data);

        // Default to empty array if data is null or invalid
        const safeData = Array.isArray(data) ? data : [];
        setPosts(safeData.map(post => ({
          id: post._id,
          category: post.category,
          title: post.title,
          description: post.description || '', // Use description as per schema
          createdAt: post.createdAt || new Date().toISOString(),
          updatedAt: post.updatedAt || post.createdAt || new Date().toISOString(),
          displayDate: formatDistanceToNow(new Date(post.createdAt), { addSuffix: true }),
          location: post.venue || '', // Use venue as per schema
          time: post.time || '',
          startTime: post.startTime || '',
          endTime: post.endTime || '',
          participants: post.participants || '',
          image: post.image || '',
          postedBy: post.postedBy?.name || 'Unknown',
          registerLink: post.registerLink || '',
          icon: getIconFromCategory(post.category),
          color: getCategoryColor(post.category),
          textColor: getTextColorFromCategory(post.category),
        })));
      } catch (err) {
        console.error('Announcements fetch error:', err.message, { status: err.status });
        setPosts([]); // Default to empty on error
      } finally {
        setLoading(false);
      }
    };

    const getIconFromCategory = (category) => {
      const icons = {
        'Events': Trophy,
        'Exams': BookOpen,
        'Holiday': AlertCircle,
        'General': Coffee,
      };
      return icons[category] || AlertCircle;
    };

    const getTextColorFromCategory = (category) => {
      const colors = {
        'Events': 'text-blue-800',
        'Exams': 'text-orange-800',
        'Holiday': 'text-green-800',
        'General': 'text-gray-800',
      };
      return colors[category] || 'text-gray-800';
    };

    fetchAnnouncements();
  }, []);

  const categories = ['All', 'Events', 'Exams', 'Holiday', 'General'];
  const dateFilters = ['All', 'Today', 'This Week', 'This Month'];

  const clearDateFilters = () => {
    setStartDate('');
    setEndDate('');
  };

  const setQuickDateFilter = (filter) => {
    const today = new Date('2025-07-26T10:02:00+05:30'); // 10:02 AM IST, July 26, 2025
    const todayStr = today.toISOString().split('T')[0];
    
    switch(filter) {
      case 'Today':
        setStartDate(todayStr);
        setEndDate(todayStr);
        break;
      case 'This Week':
        const weekStart = new Date(today);
        weekStart.setDate(today.getDate() - today.getDay());
        setStartDate(weekStart.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      case 'This Month':
        const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
        setStartDate(monthStart.toISOString().split('T')[0]);
        setEndDate(todayStr);
        break;
      case 'All':
        clearDateFilters();
        break;
    }
  };

  const isDateInRange = (postDate, start, end) => {
    const date = new Date(postDate).toISOString().split('T')[0];
    const startCheck = !start || date >= start;
    const endCheck = !end || date <= end;
    return startCheck && endCheck;
  };

  const filteredPosts = posts.filter(post => {
    const categoryMatch = activeCategory === 'All' || post.category === activeCategory;
    const dateMatch = isDateInRange(post.createdAt, startDate, endDate); // Use createdAt for filtering
    const searchMatch = !searchQuery || 
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()); // Use description
    return categoryMatch && dateMatch && searchMatch;
  });

  const getCategoryColor = (category) => {
    const colors = {
      'Events': 'bg-blue-100 text-blue-800',
      'Exams': 'bg-orange-100 text-orange-800',
      'Holiday': 'bg-green-100 text-green-800',
      'General': 'bg-gray-100 text-gray-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const formatFullDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <button 
                  onClick={() => window.history.back()} 
                  className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                  title="Go Back"
                >
                  <ArrowLeft className="h-6 w-6 text-blue-600" />
                </button>
                <h1 className="text-3xl font-bold text-gray-900">Campus Announcements</h1>
              </div>
              <p className="text-gray-600 text-lg">Stay updated with the latest news, events, and important notices from Sri Eshwar College of Engineering</p>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-2 gap-4 mt-6 lg:mt-0">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-4 text-white text-center">
                <div className="text-2xl font-bold">{posts.length}</div>
                <div className="text-sm opacity-90">Total Posts</div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white text-center">
                <div className="text-2xl font-bold">{filteredPosts.length}</div>
                <div className="text-sm opacity-90">Showing</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search announcements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                      activeCategory === category
                        ? 'bg-blue-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Date Range</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {dateFilters.map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setQuickDateFilter(filter)}
                    className="px-3 py-2 text-sm rounded-lg font-medium transition-all duration-200 bg-gray-100 text-gray-600 hover:bg-gray-200"
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {/* View Toggle */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">View Mode</label>
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`flex-1 py-2 px-4 rounded-lg font-medium transition-all ${
                    viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-600'
                  }`}
                >
                  List
                </button>
              </div>
            </div>
          </div>

          {/* Active Filters */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">
                {filteredPosts.length} announcement{filteredPosts.length !== 1 ? 's' : ''}
              </span>
              {(activeCategory !== 'All' || searchQuery || startDate || endDate) && (
                <button
                  onClick={() => {
                    setActiveCategory('All');
                    setSearchQuery('');
                    clearDateFilters();
                  }}
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">
              Last updated: {new Date('2025-07-26T10:02:00+05:30').toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Posts Grid/List */}
        {loading ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <div className="animate-spin h-10 w-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">Loading...</h3>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">No announcements found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search terms or filters to see more results.</p>
            <button 
              onClick={() => {
                setActiveCategory('All');
                setSearchQuery('');
                clearDateFilters();
              }}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredPosts.map((post) => {
              const IconComponent = post.icon || AlertCircle; // Fallback icon
              return (
                <div 
                  key={post.id} 
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image Section */}
                  {post.image && (
                    <div className="relative overflow-hidden h-48">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${getCategoryColor(post.category)}`}>
                          {post.category}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Header */}
                    <div className="mb-4">
                      <div className="text-sm text-gray-500 mb-2" title={formatFullDate(post.createdAt)}>
                        {post.displayDate}
                      </div>
                    </div>

                    {/* Title and Content */}
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {post.description}
                    </p>

                    {/* Details */}
                    <div className="space-y-2 mb-4">
                      {(post.startTime || post.endTime) && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{post.startTime && post.endTime ? `${post.startTime} - ${post.endTime}` : post.startTime || post.endTime || post.time}</span>
                        </div>
                      )}
                      {post.time && !post.startTime && !post.endTime && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{post.time}</span>
                        </div>
                      )}
                      {post.location && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{post.location}</span>
                        </div>
                      )}
                      {post.participants && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{post.participants}</span>
                        </div>
                      )}
                      {post.postedBy && (
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>Posted by: {post.postedBy}</span>
                        </div>
                      )}
                    </div>

                    {/* Register Button for Events */}
                    {post.category === 'Events' && post.registerLink && (
                      <div className="pt-4 border-t border-gray-100">
                        <a href={post.registerLink} target="_blank" rel="noopener noreferrer" className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all block text-center">
                          Register Now
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="space-y-6">
            {filteredPosts.map((post) => {
              const IconComponent = post.icon || AlertCircle; // Fallback icon
              return (
                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 overflow-hidden">
                  {/* Post Header */}
                  <div className="p-4 flex items-center justify-between">
                    <p className="text-xs text-gray-500" title={formatFullDate(post.createdAt)}>
                      {post.displayDate}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(post.category)}`}>
                        {post.category}
                      </span>
                    </div>
                  </div>

                  {/* Post Content */}
                  <div className="px-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{post.description}</p>
                  </div>

                  {/* Post Image */}
                  {post.image && (
                    <div className="mt-3 mx-4">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  )}

                  {/* Post Details */}
                  <div className="px-4 mt-3 pb-2">
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      {(post.startTime || post.endTime) && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.startTime && post.endTime ? `${post.startTime} - ${post.endTime}` : post.startTime || post.endTime || post.time}</span>
                        </div>
                      )}
                      {post.time && !post.startTime && !post.endTime && (
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{post.time}</span>
                        </div>
                      )}
                      {post.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{post.location}</span>
                        </div>
                      )}
                      {post.participants && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{post.participants}</span>
                        </div>
                      )}
                      {post.postedBy && (
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>Posted by: {post.postedBy}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Register Button for Events */}
                  {post.category === 'Events' && post.registerLink && (
                    <div className="px-4 py-3 border-t border-gray-100">
                      <div className="flex justify-end">
                        <a href={post.registerLink} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                          Register Now
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default AnnouncementPostPage;