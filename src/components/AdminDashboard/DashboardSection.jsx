import React from 'react';
import { Users, Megaphone, AlertTriangle, CheckCircle, Calendar } from 'lucide-react';

const DashboardSection = ({ announcements, complaints, stats, setActiveSection, getStatusColor, formatDate }) => {
  const quickStats = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-blue-600 bg-blue-50' },
    { label: 'Active Announcements', value: stats.publishedAnnouncements, icon: Megaphone, color: 'text-green-600 bg-green-50' },
    { label: 'Pending Complaints', value: stats.pendingComplaints, icon: AlertTriangle, color: 'text-orange-600 bg-orange-50' },
    { label: 'Resolved Today', value: stats.resolvedComplaints, icon: CheckCircle, color: 'text-purple-600 bg-purple-50' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Admin Dashboard</h2>
        <p className="text-gray-600">Manage campus announcements, complaints, and users</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Announcements</h3>
          <div className="space-y-3">
            {announcements.slice(0, 3).map((announcement) => (
              <div key={announcement.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{announcement.title}</p>
                  <p className="text-sm text-gray-600">{announcement.category}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(announcement.status)}`}>
                  {announcement.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveSection('announcements')}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Complaints</h3>
          <div className="space-y-3">
            {complaints.slice(0, 3).map((complaint) => (
              <div key={complaint.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{complaint.title}</p>
                  <p className="text-sm text-gray-600">{complaint.studentName} - {complaint.room}</p>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
              </div>
            ))}
          </div>
          <button
            onClick={() => setActiveSection('complaints')}
            className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;