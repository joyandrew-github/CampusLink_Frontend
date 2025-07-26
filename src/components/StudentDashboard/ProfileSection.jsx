import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { User, Mail, Phone, School, Calendar, Home } from 'lucide-react';

const ProfileSection = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');

        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/auth/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch profile');

        setUser(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  // Get initials for avatar placeholder
  const getInitials = (name) => {
    if (!name) return '';
    const names = name.trim().split(' ');
    return names.length > 1
      ? `${names[0][0]}${names[names.length - 1][0]}`
      : names[0].slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-600 text-lg">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Profile</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-6 mb-6">
          {user.profileImage ? (
            <img
              src={user.profileImage}
              alt={`${user.name}'s profile`}
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-2xl">{getInitials(user.name)}</span>
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-gray-800">{user.name}</h3>
            {user.role === 'student' && (
              <>
                <p className="text-gray-600">{user.dept}</p>
                <p className="text-gray-500">Student ID: {user.rollNo}</p>
              </>
            )}
            {user.role === 'admin' && (
              <p className="text-gray-600">Administrator</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Contact Information</h4>
            <div className="flex items-center space-x-2 mb-2">
              <Mail size={16} className="text-blue-600" />
              <p className="text-gray-600">Email: {user.email}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Phone size={16} className="text-blue-600" />
              <p className="text-gray-600">Phone: {user.phoneNo}</p>
            </div>
          </div>
          {user.role === 'student' && (
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Academic Information</h4>
              <div className="flex items-center space-x-2 mb-2">
                <Calendar size={16} className="text-blue-600" />
                <p className="text-gray-600">Year: {user.year}th Year</p>
              </div>
              <div className="flex items-center space-x-2">
                <Home size={16} className="text-blue-600" />
                <p className="text-gray-600">
                  Accommodation: {user.accommodation === 'dayscholar' ? 'Day Scholar' : 'Hosteller'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;