import React, { useState, useEffect } from 'react';
import { ChevronRight, AlertTriangle, Package, Clock } from 'lucide-react';
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

const DashboardSection = ({ setActiveSection }) => {
  const [stats, setStats] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch stats and recent activities
  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token) {
        console.warn('No authentication token found, using default values');
        setDefaultStatsAndActivities(userId);
        setLoading(false);
        return;
      }

      const decodedToken = decodeToken(token);
      console.log('Dashboard - Decoded token:', decodedToken);

      try {
        const [complaintsRes, lostFoundRes, timetableRes, pendingComplaintsRes] = await Promise.all([
          fetch('https://campuslink-backend-7auz.onrender.com/api/complaints', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://campuslink-backend-7auz.onrender.com/api/lostfound', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://campuslink-backend-7auz.onrender.com/api/timetable', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch('https://campuslink-backend-7auz.onrender.com/api/complaints?status=pending', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const [complaintsData, lostFoundData, timetableData, pendingComplaintsData] = await Promise.all([
          complaintsRes.json(),
          lostFoundRes.json(),
          timetableRes.json(),
          pendingComplaintsRes.json(),
        ]);

        console.log('API Responses:', {
          complaints: complaintsData,
          lostFound: lostFoundData,
          timetable: timetableData,
          pendingComplaints: pendingComplaintsData,
        });

        // Default to empty arrays if data is null or undefined
        const safeComplaintsData = Array.isArray(complaintsData) ? complaintsData : [];
        const safeLostFoundData = Array.isArray(lostFoundData) ? lostFoundData : [];
        const safeTimetableData = timetableData.schedule && Array.isArray(timetableData.schedule) ? timetableData : { schedule: [] };
        const safePendingComplaintsData = Array.isArray(pendingComplaintsData) ? pendingComplaintsData : [];

        // Use current date and time (08:59 AM IST, July 26, 2025)
        const today = new Date('2025-07-26T08:59:00+05:30'); // IST
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday, July 21, 2025
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 }); // Sunday, July 27, 2025

        // Count classes in current week based on date
        let currentWeekClasses = 0;
        if (safeTimetableData.schedule) {
          safeTimetableData.schedule.forEach(week => {
            ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].forEach(day => {
              if (week[day] && Array.isArray(week[day])) {
                week[day].forEach(cls => {
                  const classDate = new Date(cls.date);
                  if (classDate >= weekStart && classDate <= weekEnd) {
                    currentWeekClasses++;
                  }
                });
              }
            });
          });
        }

        // Set stats with default 0 for empty or failed data
        setStats([
          {
            label: 'Total Complaints',
            value: safeComplaintsData.length || 0,
            icon: AlertTriangle,
            color: 'bg-blue-100 text-blue-600',
          },
          {
            label: 'Lost/Found Items',
            value: safeLostFoundData.filter(item => item.postedBy?._id.toString() === userId).length || 0,
            icon: Package,
            color: 'bg-blue-600 text-white',
          },
          {
            label: 'Classes This Week',
            value: currentWeekClasses || 0,
            icon: Clock,
            color: 'bg-blue-500 text-white',
          },
          {
            label: 'Pending Complaints',
            value: safePendingComplaintsData.length || 0,
            icon: AlertTriangle,
            color: 'bg-red-100 text-red-600',
          },
        ]);

        // Combine recent activities
        const allActivities = [
          ...safeComplaintsData.map(complaint => ({
            type: 'post',
            message: `${complaint.title} updated to ${complaint.status.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}`,
            timestamp: new Date(complaint.updatedAt),
            icon: AlertTriangle,
            color: 'bg-blue-100 text-blue-700',
          })),
          ...safeLostFoundData
            .filter(item => item.postedBy?._id.toString() === userId)
            .map(item => ({
              type: 'post',
              message: `Your ${item.status} ${item.itemName} ${item.status === 'found' ? 'was found' : 'reported'} at ${item.location}`,
              timestamp: new Date(item.date),
              icon: Package,
              color: 'bg-blue-600 text-white',
            })),
          ...(safeTimetableData.schedule
            ? safeTimetableData.schedule
                .flatMap((week, index) =>
                  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].flatMap(day =>
                    (week[day] || []).map(cls => ({
                      type: 'post',
                      message: `${cls.subject} ${cls.status} to ${cls.room}`,
                      timestamp: new Date(cls.date),
                      icon: Clock,
                      color: cls.status === 'scheduled' ? 'bg-blue-100 text-blue-600' : 'bg-yellow-100 text-yellow-600',
                      weekIndex: index,
                    }))
                  )
                )
                .filter(item => {
                  const itemDate = new Date(item.timestamp);
                  return itemDate >= weekStart && itemDate <= weekEnd && item.status !== 'scheduled';
                })
            : []),
        ];

        // Sort by timestamp (newest first) and limit to 5
        const recentActivities = allActivities
          .sort((a, b) => b.timestamp - a.timestamp)
          .map(activity => ({
            ...activity,
            timeAgo: formatDistanceToNow(activity.timestamp, { addSuffix: true }),
          }));

        setActivities(recentActivities);
      } catch (err) {
        console.error('Dashboard fetch error:', err.message, { status: err.status });
        setDefaultStatsAndActivities(userId); // Default to 0 and empty activities on error
      } finally {
        setLoading(false);
      }
    };

    const setDefaultStatsAndActivities = (userId) => {
      setStats([
        { label: 'Total Complaints', value: 0, icon: AlertTriangle, color: 'bg-blue-100 text-blue-600' },
        { label: 'Lost/Found Items', value: 0, icon: Package, color: 'bg-blue-600 text-white' },
        { label: 'Classes This Week', value: 0, icon: Clock, color: 'bg-blue-500 text-white' },
        { label: 'Pending Complaints', value: 0, icon: AlertTriangle, color: 'bg-red-100 text-red-600' },
      ]);
      setActivities([]);
    };

    fetchDashboardData();
  }, []);

  return (
    <div>
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-900 rounded-2xl text-white p-8 mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Welcome to <span className="text-yellow-300">CampusLink</span>
          </h1>
          <p className="text-xl mb-4 text-blue-100">
            Your Centralized Student Utility Hub
          </p>
          <p className="text-blue-50 mb-6 max-w-2xl">
            Stay connected with all campus activities, manage your schedule, track complaints, and find lost items. 
            Everything you need for your academic journey, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={() => setActiveSection('lost-found')}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors flex items-center space-x-2"
            >
              <span>Quick Actions</span>
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => { window.location.href = '/announcements'; }}
              className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              View Announcements
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-4 right-4 w-20 h-20 bg-white opacity-10 rounded-full"></div>
        <div className="absolute bottom-4 right-12 w-32 h-32 bg-yellow-300 opacity-20 rounded-full"></div>
        <div className="absolute top-1/2 right-1/4 w-16 h-16 bg-indigo-300 opacity-15 rounded-full"></div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {loading ? (
          <div className="col-span-full text-center text-gray-600">Loading...</div>
        ) : (
          stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-semibold">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-800 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon size={24} />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-6">Recent Activity</h3>
        {loading ? (
          <div className="text-center text-gray-600">Loading...</div>
        ) : activities.length === 0 ? (
          <div className="text-center text-gray-600">No recent activities</div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                <div className={`p-2 rounded-lg ${activity.color}`}>
                  <activity.icon size={20} />
                </div>
                <div className="flex-1">
                  <p className="text-gray-800 font-medium">{activity.message}</p>
                  <p className="text-gray-500 text-sm mt-1">{activity.timeAgo}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardSection;