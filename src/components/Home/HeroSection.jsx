import React, { useState, useEffect } from 'react';
import { Star, ArrowRight, Play, AlertCircle, CheckCircle, Calendar, Sparkles, MapPin, Clock, Users, BookOpen, Wifi, Coffee } from 'lucide-react';

const Hero = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

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
      color: "purple",
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

  return (
    <section id="home" className="relative py-10 overflow-hidden min-h-[85vh] flex items-center">
      {/* Enhanced Background with Moving Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/8 via-purple-600/6 to-amber-500/8"></div>
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-indigo-500/5 to-transparent animate-pulse"></div>
      
      {/* More Sophisticated Background Elements */}
      <div className="absolute top-20 left-10 h-4 w-4 bg-blue-400 rounded-full animate-ping opacity-60"></div>
      <div className="absolute top-40 right-20 h-2 w-2 bg-purple-400 rounded-full animate-bounce opacity-50"></div>
      <div className="absolute bottom-32 left-20 h-6 w-6 bg-amber-400 rounded-full animate-pulse opacity-40"></div>
      <div className="absolute bottom-20 right-40 h-3 w-3 bg-indigo-400 rounded-full animate-ping opacity-50"></div>
      <div className="absolute top-60 left-1/4 h-1 w-1 bg-emerald-400 rounded-full animate-bounce opacity-60"></div>
      <div className="absolute bottom-60 right-1/4 h-2 w-2 bg-pink-400 rounded-full animate-pulse opacity-40"></div>
      
      {/* Floating Shape Elements */}
      <div className="absolute top-32 right-1/3 h-20 w-20 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-3xl rotate-45 animate-floatSlow opacity-60"></div>
      <div className="absolute bottom-40 left-1/3 h-16 w-16 bg-gradient-to-br from-amber-200/30 to-orange-200/30 rounded-full animate-float opacity-50"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Side - Enhanced */}
          <div className="space-y-8 relative z-10">
            <div className="space-y-6">
              <div className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 rounded-full text-sm font-semibold shadow-lg animate-slideInUp">
                <Star className="h-4 w-4 mr-2 animate-spin-slow" />
                Trusted by 2,500+ Students at SECE
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-tight animate-slideInUp delay-200">
                Your Campus,
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500 text-transparent bg-clip-text animate-gradient"> Connected</span>
              </h1>
              
              <p className="text-xl lg:text-2xl text-gray-600 leading-relaxed animate-slideInUp delay-400">
                CampusLink streamlines student life at Sri Eshwar College of Engineering. From announcements to skill sharing, everything you need in one beautiful platform.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slideInUp delay-600">
              <button className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transform hover:-translate-y-2 hover:scale-105 transition-all duration-300 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <span className="relative z-10 flex items-center">
                  Launch Dashboard
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
              
              <button className="group border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-semibold text-lg hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-300 flex items-center justify-center">
                <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                View Demo
              </button>
            </div>

            {/* Enhanced Feature Tags */}
            <div className="flex flex-wrap gap-3 pt-8 animate-slideInUp delay-800">
              <div className="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 rounded-full text-sm font-medium border border-blue-200 hover:shadow-lg transition-all duration-300">
                <Sparkles className="h-4 w-4 mr-2 group-hover:animate-spin" />
                NLP Analysis
              </div>
              <div className="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-green-50 to-emerald-100 text-green-700 rounded-full text-sm font-medium border border-green-200 hover:shadow-lg transition-all duration-300">
                <CheckCircle className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Smart Categories
              </div>
              <div className="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-purple-50 to-purple-100 text-purple-700 rounded-full text-sm font-medium border border-purple-200 hover:shadow-lg transition-all duration-300">
                <Users className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
                Query Chatbot
              </div>
              <div className="group inline-flex items-center px-5 py-3 bg-gradient-to-r from-amber-50 to-orange-100 text-amber-700 rounded-full text-sm font-medium border border-amber-200 hover:shadow-lg transition-all duration-300">
                <Clock className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform duration-300" />
                Real-time Updates
              </div>
            </div>
          </div>

          {/* Right Side - Sophisticated Dashboard Preview */}
          <div className="relative">
            {/* Main Floating Container - Larger and More Detailed */}
            <div className="relative z-10 animate-floatGentle">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 overflow-hidden flex flex-col h-96">
                {/* Enhanced Browser Header */}
                <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-3 w-3 bg-white/40 rounded-full animate-pulse"></div>
                      <div className="h-3 w-3 bg-white/40 rounded-full animate-pulse delay-100"></div>
                      <div className="h-3 w-3 bg-white/40 rounded-full animate-pulse delay-200"></div>
                    </div>
                    <div className="text-white/80 text-sm font-medium">CampusLink Dashboard</div>
                  </div>
                </div>
                
                {/* Tab Navigation */}
                <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                  <div className="flex space-x-6">
                    {tabs.map((tab, index) => (
                      <button
                        key={index}
                        onClick={() => setActiveTab(index)}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium ${
                          activeTab === index
                            ? 'bg-white text-blue-600 shadow-md'
                            : 'text-gray-600'
                        }`}
                      >
                        <tab.icon className="h-4 w-4" />
                        <span>{tab.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Content Area */}
                <div className="p-6 space-y-4 flex-1">
                  {activeTab === 0 && (
                    <div className="space-y-4">
                      {announcements.map((announcement, index) => {
                        const IconComponent = announcement.icon;
                        return (
                          <div
                            key={index}
                            className={`flex items-start space-x-4 p-4 rounded-xl ${
                              index === currentAnnouncement ? 'bg-blue-50 border-l-4 border-blue-500' : 'bg-gray-50'
                            }`}
                          >
                            <div className={`h-12 w-12 bg-${announcement.color}-100 rounded-xl flex items-center justify-center flex-shrink-0`}>
                              <IconComponent className={`h-6 w-6 text-${announcement.color}-600`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 truncate">{announcement.title}</h4>
                                <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${announcement.color}-100 text-${announcement.color}-700`}>
                                  {announcement.category}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{announcement.description}</p>
                              <div className="flex items-center text-xs text-gray-500">
                                <Clock className="h-3 w-3 mr-1" />
                                {announcement.time}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {activeTab === 1 && (
                    <div className="space-y-3">
                      {lostFoundItems.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                              <MapPin className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{item.item}</h4>
                              <p className="text-xs text-gray-600">{item.location}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                            item.status === 'Lost' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 2 && (
                    <div className="space-y-3">
                      {complaints.map((complaint, index) => (
                        <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <AlertCircle className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-gray-900">{complaint.issue}</h4>
                              <p className="text-xs text-gray-600">{complaint.hostel}</p>
                            </div>
                          </div>
                          <span className={`px-3 py-1 text-xs font-medium rounded-full ${
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

                {/* Bottom Stats Bar */}
                <div className="bg-gradient-to-r from-gray-50 to-blue-50 px-6 py-3 border-t border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Users className="h-4 w-4" />
                        <span className="text-xs">2,500+ Active</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Wifi className="h-4 w-4" />
                        <span className="text-xs">Online</span>
                      </div>
                    </div>
                    <div className="text-xs text-blue-600 font-medium">
                      Updated 2 min ago
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Enhanced Background Effects with Multiple Layers */}
            <div className="absolute -top-8 -right-8 h-96 w-96 bg-gradient-to-br from-blue-400/20 via-purple-400/15 to-indigo-400/20 rounded-full opacity-60 blur-3xl animate-floatReverse"></div>
            <div className="absolute -bottom-8 -left-8 h-96 w-96 bg-gradient-to-br from-amber-400/20 via-orange-400/15 to-pink-400/20 rounded-full opacity-60 blur-3xl animate-floatGentle delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-72 w-72 bg-gradient-to-br from-emerald-400/10 to-teal-400/10 rounded-full opacity-40 blur-2xl animate-pulse"></div>
            
            {/* Additional Floating Elements */}
            <div className="absolute -top-4 left-1/4 h-6 w-6 bg-gradient-to-br from-blue-300 to-blue-500 rounded-lg rotate-45 animate-floatSlow opacity-70"></div>
            <div className="absolute -bottom-6 right-1/4 h-4 w-4 bg-gradient-to-br from-purple-300 to-purple-500 rounded-full animate-bounce opacity-60"></div>
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
      `}</style>
    </section>
  );
};

export default Hero;