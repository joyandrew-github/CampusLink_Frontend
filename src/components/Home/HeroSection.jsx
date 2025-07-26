import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Play, AlertCircle, CheckCircle, Calendar, Sparkles, MapPin, Clock, Users, BookOpen, Wifi, Coffee } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

// Authentication hook to verify token and extract user data
const useAuth = () => {
  const token = localStorage.getItem('token');
  let user = null;
  let isAuthenticated = false;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      user = { id: decoded.id, role: decoded.role };
      isAuthenticated = true;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
    }
  }

  return { user, isAuthenticated };
};

const Hero = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const announcements = [
    {
      icon: AlertCircle,
      title: "Mid-Semester Exams Postponed",
      description: "Engineering Mathematics exam moved to Dec 15th",
      category: "Academic",
      color: "blue",
      time: "2 hours ago"
    },
    {
      icon: Calendar,
      title: "Tech Fest Registration Open",
      description: "Annual technical festival - Register now!",
      category: "Events",
      color: "blue",
      time: "5 hours ago"
    }
  ];

  const lostFoundItems = [
    { item: "iPhone 13", location: "Cafeteria", status: "Lost", color: "red" },
    { item: "Notebook", location: "Library", status: "Found", color: "green" },
    { item: "Water Bottle", location: "Lab Block", status: "Found", color: "green" }
  ];

  const complaints = [
    { issue: "AC not working", hostel: "Block A", status: "In Progress", color: "yellow" },
    { issue: "WiFi connectivity", hostel: "Block B", status: "Resolved", color: "green" }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % announcements.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const tabs = [
    { name: "Announcements", icon: AlertCircle },
    { name: "Lost & Found", icon: MapPin },
    { name: "Complaints", icon: CheckCircle },
  ];

  // Handle dashboard navigation based on role
  const handleDashboardClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(user?.role === 'admin' ? '/admin-dashboard' : '/student-dashboard');
    }
  };

  return (
    <section id="home" className="relative py-10 overflow-hidden min-h-[85vh] flex items-center">
      {/* Simplified Background with Consistent Colors */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-amber-50"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-blue-600/5 to-transparent animate-pulse"></div>
      
      {/* Background Elements - Using consistent colors */}
      <div className="absolute top-10 sm:top-20 left-5 sm:left-10 h-3 w-3 sm:h-4 sm:w-4 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-20 sm:top-40 right-10 sm:right-20 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-blue-400 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute bottom-20 sm:bottom-32 left-10 sm:left-20 h-4 w-4 sm:h-6 sm:w-6 bg-amber-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-10 sm:bottom-20 right-20 sm:right-40 h-2 w-2 sm:h-3 sm:w-3 bg-blue-400 rounded-full animate-ping opacity-50"></div>
      <div className="absolute top-32 sm:top-60 left-1/4 h-0.5 w-0.5 sm:h-1 sm:w-1 bg-gray-400 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute bottom-32 sm:bottom-60 right-1/4 h-1.5 w-1.5 sm:h-2 sm:w-2 bg-gray-400 rounded-full animate-pulse opacity-40"></div>
      
      {/* Floating Shape Elements - Consistent colors */}
      <div className="absolute top-16 sm:top-32 right-1/3 h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 bg-gradient-to-br from-blue-200/30 to-blue-300/30 rounded-2xl sm:rounded-3xl rotate-45 animate-floatSlow opacity-60"></div>
      <div className="absolute bottom-20 sm:bottom-40 left-1/3 h-10 w-10 sm:h-12 sm:w-12 lg:h-16 lg:w-16 bg-gradient-to-br from-amber-200/30 to-amber-300/30 rounded-full animate-float opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          {/* Left Side - Enhanced Mobile Responsiveness */}
          <div className="space-y-4 sm:space-y-6 lg:space-y-8 relative z-10 text-center lg:text-left">
            <div className="space-y-4 sm:space-y-6">
              <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-amber-100 to-amber-200 text-amber-800 rounded-full text-xs sm:text-sm font-semibold shadow-lg animate-slideInUp">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin-slow" />
                <span className="hidden xs:inline">Trusted by 2,500+ Students at SECE</span>
                <span className="xs:hidden">2,500+ SECE Students</span>
              </div>
              
              <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight animate-slideInUp delay-200">
                Your Campus,
                <br className="sm:hidden" />
                <span className="bg-gradient-to-r from-blue-600 to-blue-700 text-transparent bg-clip-text animate-gradient"> Connected</span>
              </h1>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 leading-relaxed animate-slideInUp delay-400 max-w-2xl mx-auto lg:mx-0">
                CampusLink streamlines student life at Sri Eshwar College of Engineering. From announcements to skill sharing, everything you need in one beautiful platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 animate-slideInUp delay-600 justify-center lg:justify-start">
              <button 
                onClick={handleDashboardClick}
                className="group bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center justify-center relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              
              <button 
                onClick={() => navigate('/announcements')}
                className="group border-2 border-gray-300 text-gray-700 px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold text-base sm:text-lg hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center"
              >
                <Play className="mr-2 h-4 w-4 sm:h-5 sm:w-5 group-hover:scale-110 transition-transform duration-300" />
                Announcements
              </button>
            </div>

            {/* Enhanced Feature Tags - Consistent colors */}
            <div className="flex flex-wrap gap-2 sm:gap-3 pt-4 sm:pt-8 animate-slideInUp delay-800 justify-center lg:justify-start">
              <div className="group inline-flex items-center px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium border border-blue-200 hover:shadow-lg transition-all duration-300">
                <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:animate-spin" />
                NLP Analysis
              </div>
              <div className="group inline-flex items-center px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 rounded-full text-xs sm:text-sm font-medium border border-gray-200 hover:shadow-lg transition-all duration-300">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:scale-110 transition-transform duration-300" />
                Smart Categories
              </div>
              <div className="group inline-flex items-center px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium border border-blue-200 hover:shadow-lg transition-all duration-300">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:scale-110 transition-transform duration-300" />
                Query Chatbot
              </div>
              <div className="group inline-flex items-center px-3 sm:px-5 py-2 sm:py-3 bg-gradient-to-r from-amber-50 to-amber-100 text-amber-700 rounded-full text-xs sm:text-sm font-medium border border-amber-200 hover:shadow-lg transition-all duration-300">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Real-time Updates
              </div>
            </div>
          </div>

          {/* Right Side - Mobile Responsive Dashboard */}
          <div className="relative mt-8 lg:mt-0">
            {/* Main Floating Container - Responsive sizing */}
            <div className="relative z-10 animate-floatGentle">
              <div className="bg-white/90 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden flex flex-col h-80 sm:h-96">
                {/* Enhanced Browser Header - Consistent colors */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2 sm:space-x-3">
                      <div className="h-2 w-2 sm:h-3 sm:w-3 bg-white/40 rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 sm:h-3 sm:w-3 bg-white/40 rounded-full animate-pulse delay-100"></div>
                      <div className="h-2 w-2 sm:h-3 sm:w-3 bg-white/40 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <div className="text-white/80 text-xs sm:text-sm font-medium">CampusLink Dashboard</div>
                  </div>
                </div>
                
                {/* Tab Navigation - Mobile responsive */}
                <div className="bg-gray-50 px-3 sm:px-6 py-2 sm:py-3 border-b border-gray-200">
                  <div className="flex space-x-2 sm:space-x-6 overflow-x-auto">
                    {tabs.map((tab, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap ${
                          activeTab === index
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600'
                        }`}
                      >
                        <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="hidden xs:inline">{tab.name}</span>
                        <span className="xs:hidden">{tab.name.split(' ')[0]}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Content Area - Mobile responsive */}
                <div className="p-3 sm:p-6 space-y-2 sm:space-y-4 flex-1">
                  {activeTab === 0 && (
                    <div className="space-y-2 sm:space-y-4">
                      {announcements.slice(0, 2).map((announcement, index) => {
                        const IconComponent = announcement.icon;
                        return (
                          <div
                            key={index}
                            className={`flex items-start space-x-2 sm:space-x-4 p-2 sm:p-4 rounded-lg sm:rounded-xl ${
                              index === currentAnnouncement ? 'bg-blue-50 border-l-2 sm:border-l-4 border-blue-500' : 'bg-gray-50'
                            }`}
                          >
                            <div className="h-8 w-8 sm:h-12 sm:w-12 bg-blue-100 rounded-lg sm:rounded-xl flex items-center justify-center flex-shrink-0">
                              <IconComponent className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 truncate">{announcement.title}</h4>
                                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700 hidden xs:inline">
                                  {announcement.category}
                                </span>
                              </div>
                              <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">{announcement.description}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                {announcement.time}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="space-y-2 sm:space-y-3">
                      {lostFoundItems.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-medium text-gray-900">{item.item}</h4>
                              <p className="text-xs text-gray-600">{item.location}</p>
                            </div>
                          </div>
                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full ${
                            item.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="space-y-2 sm:space-y-3">
                      {complaints.slice(0, 2).map((complaint, index) => (
                        <div key={index} className="flex items-center justify-between p-2 sm:p-4 bg-gray-50 rounded-lg sm:rounded-xl">
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <div className="h-8 w-8 sm:h-10 sm:w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-xs sm:text-sm font-medium text-gray-900">{complaint.issue}</h4>
                              <p className="text-xs text-gray-600">{complaint.hostel}</p>
                            </div>
                          </div>
                          <span className={`px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-medium rounded-full ${
                            complaint.status === 'Pending' ? 'bg-red-100 text-red-700' :
                            complaint.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-green-100 text-green-700'
                          }`}>
                            {complaint.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Bottom Stats Bar - Mobile responsive */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-3 sm:px-6 py-2 sm:py-3 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between text-xs sm:text-sm text-gray-600">
                    <div className="flex items-center space-x-2 sm:space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs">2,500+ Active</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wifi className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="text-xs hidden xs:inline">Online</span>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Updated 2 min ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Simplified Background Effects - Consistent colors */}
            <div className="absolute -top-4 sm:-top-8 -right-4 sm:-right-8 h-60 w-60 sm:h-80 sm:w-80 lg:h-96 lg:w-96 bg-gradient-to-br from-blue-400/20 to-blue-500/15 rounded-full opacity-60 blur-3xl animate-floatReverse"></div>
            <div className="absolute -bottom-4 sm:-bottom-8 -left-4 sm:-left-8 h-60 w-60 sm:h-80 sm:w-80 lg:h-96 lg:w-96 bg-gradient-to-br from-amber-400/20 to-amber-500/15 rounded-full opacity-60 blur-3xl animate-floatGentle delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-48 w-48 sm:h-60 sm:w-60 lg:h-72 lg:w-72 bg-gradient-to-br from-gray-400/10 to-gray-500/10 rounded-full opacity-40 blur-2xl animate-pulse"></div>
            
            {/* Additional Floating Elements - Consistent colors */}
            <div className="absolute -top-2 sm:-top-4 left-1/4 h-4 w-4 sm:h-6 sm:w-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded-lg rotate-45 animate-floatSlow opacity-70"></div>
            <div className="absolute -bottom-3 sm:-bottom-6 right-1/4 h-3 w-3 sm:h-4 sm:w-4 bg-gradient-to-br from-blue-300 to-blue-500 rounded-full animate-bounce opacity-60"></div>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes floatGentle {
          0%, 100% { transform: translateY(0px) rotateY(0deg); }
          25% { transform: translateY(-8px) rotateY(1deg); }
          50% { transform: translateY(-12px) rotateY(0deg); }
          75% { transform: translateY(-6px) rotateY(-1deg); }
        }
        
        @keyframes floatReverse {
          0%, 100% { transform: translateY(0px) rotateX(0deg); }
          33% { transform: translateY(12px) rotateX(-2deg); }
          66% { transform: translateY(6px) rotateX(2deg); }
        }
        
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          50% { transform: translateY(-20px) rotate(5deg) scale(1.05); }
        }
        
        @keyframes slideInUp {
          0% { transform: translateY(60px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .animate-floatGentle {
          animation: floatGentle 8s ease-in-out infinite;
        }
        
        .animate-floatReverse {
          animation: floatReverse 10s ease-in-out infinite;
        }
        
        .animate-floatSlow {
          animation: floatSlow 12s ease-in-out infinite;
        }
        
        .animate-slideInUp {
          animation: slideInUp 0.8s ease-out forwards;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-400 { animation-delay: 0.4s; }
        .delay-600 { animation-delay: 0.6s; }
        .delay-800 { animation-delay: 0.8s; }
        .delay-1000 { animation-delay: 1s; }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Custom breakpoint for very small screens */
        @media (min-width: 480px) {
          .xs\:inline { display: inline; }
          .xs\:hidden { display: none; }
        }
      `}</style>
    </section>
  );
};

export default Hero;