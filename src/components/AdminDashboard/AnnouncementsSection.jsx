import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar, MapPin, Clock, X, Link, User } from 'lucide-react'; // Added User, removed Users if it was incorrectly included
import { toast } from 'react-toastify';

// Helper function to decode JWT token (client-side)
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

const AnnouncementsSection = ({
  announcements,
  setAnnouncements,
  showAnnouncementForm,
  setShowAnnouncementForm,
  editingAnnouncement,
  setEditingAnnouncement,
  announcementForm,
  setAnnouncementForm,
  categories,
  formatDate,
}) => {
  const [error, setError] = useState(null);

  const handleAnnouncementSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', announcementForm.title);
    formData.append('description', announcementForm.description);
    formData.append('category', announcementForm.category);
    formData.append('venue', announcementForm.venue);
    formData.append('time', announcementForm.time); // Backward compatibility
    formData.append('startTime', announcementForm.startTime);
    formData.append('endTime', announcementForm.endTime);
    formData.append('date', announcementForm.date);
    formData.append('registerLink', announcementForm.registerLink);
    if (announcementForm.image) {
      formData.append('image', announcementForm.image);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to perform this action');
      console.error('No token found in localStorage');
      return;
    }

    const decodedToken = decodeToken(token);
    console.log('Decoded token:', decodedToken);

    try {
      let response;
      if (editingAnnouncement) {
        console.log('Updating announcement:', {
          id: editingAnnouncement._id,
          title: announcementForm.title,
          category: announcementForm.category,
          userId: decodedToken?.id,
          userRole: decodedToken?.role,
        });
        response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/announcements/${editingAnnouncement._id}`, {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      } else {
        console.log('Creating new announcement:', {
          title: announcementForm.title,
          category: announcementForm.category,
          userId: decodedToken?.id,
          userRole: decodedToken?.role,
        });
        response = await fetch('https://campuslink-backend-7auz.onrender.comckend-7auz.onrender.com/api/announcements', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to save announcement';
        if (response.status === 401) {
          throw Object.assign(
            new Error('You are not authorized to perform this action. Please log in again as an admin or contact support.'),
            { status: response.status }
          );
        }
        throw Object.assign(new Error(errorMessage), { status: response.status });
      }

      const savedAnnouncement = await response.json();
      if (editingAnnouncement) {
        setAnnouncements(announcements.map((a) => (a._id === savedAnnouncement._id ? savedAnnouncement : a)));
        setEditingAnnouncement(null);
        toast.success('Announcement updated successfully!');
      } else {
        setAnnouncements([savedAnnouncement, ...announcements]);
        toast.success('Announcement created successfully!');
      }

      setAnnouncementForm({
        title: '',
        description: '',
        category: 'General',
        venue: '',
        time: '',
        startTime: '',
        endTime: '',
        date: '',
        image: null,
        registerLink: '',
      });
      setShowAnnouncementForm(false);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Announcement save error:', err.message, {
        status: err.status || 'unknown',
        editingAnnouncementId: editingAnnouncement?._id,
      });
      toast.error(err.message);
    }
  };

  const editAnnouncement = (announcement) => {
    console.log('Editing announcement:', {
      id: announcement._id,
      title: announcement.title,
      postedBy: announcement.postedBy,
    });
    // Safely handle date formatting
    let formattedDate = '';
    if (announcement.date) {
      const dateObj = new Date(announcement.date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toISOString().split('T')[0];
      }
    }

    setAnnouncementForm({
      title: announcement.title || '',
      description: announcement.description || '',
      category: announcement.category || 'General',
      venue: announcement.venue || '',
      time: announcement.time || '',
      startTime: announcement.startTime || '',
      endTime: announcement.endTime || '',
      date: formattedDate,
      image: null,
      registerLink: announcement.registerLink || '',
    });
    setEditingAnnouncement(announcement);
    setShowAnnouncementForm(true);
  };

  const deleteAnnouncement = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to perform this action');
      console.error('No token found in localStorage');
      return;
    }

    const decodedToken = decodeToken(token);
    console.log('Deleting announcement:', { id, userId: decodedToken?.id, userRole: decodedToken?.role });

    try {
      const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/announcements/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage = errorData.message || 'Failed to delete announcement';
        if (response.status === 401) {
          throw Object.assign(
            new Error('You are not authorized to delete this announcement. Please log in again as an admin or contact support.'),
            { status: response.status }
          );
        }
        throw Object.assign(new Error(errorMessage), { status: response.status });
      }

      setAnnouncements(announcements.filter((a) => a._id !== id));
      setError(null);
      toast.success('Announcement deleted successfully!');
    } catch (err) {
      setError(err.message);
      console.error('Announcement delete error:', err.message, { id, status: err.status || 'unknown' });
      toast.error(err.message);
    }
  };

  const showRegisterLink = ['Event', 'Hackathon', 'Internship'].includes(announcementForm.category);

  // Validate announcements array
  if (!Array.isArray(announcements)) {
    console.error('Announcements prop is not an array:', announcements);
    return <div>Error: Invalid announcements data</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Announcements Management</h2>
          <p className="text-gray-600">Create and manage campus announcements</p>
        </div>
        <button
          onClick={() => {
            setAnnouncementForm({
              title: '',
              description: '',
              category: 'General',
              venue: '',
              time: '',
              startTime: '',
              endTime: '',
              date: '',
              image: null,
              registerLink: '',
            });
            setEditingAnnouncement(null);
            setShowAnnouncementForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus size={20} className="mr-2" />
          New Announcement
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
          {error.includes('not authorized') && (
            <p className="mt-2">
              <a href="/login" className="text-blue-600 hover:underline">Log in again</a> or contact support for assistance.
            </p>
          )}
        </div>
      )}

      {showAnnouncementForm && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(134, 133, 133, 0.25), rgba(100, 100, 100, 0.05))',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
        >
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  {editingAnnouncement ? 'Edit Announcement' : 'Create New Announcement'}
                </h3>
                <button
                  onClick={() => {
                    setShowAnnouncementForm(false);
                    setEditingAnnouncement(null);
                    setAnnouncementForm({
                      title: '',
                      description: '',
                      category: 'General',
                      venue: '',
                      time: '',
                      startTime: '',
                      endTime: '',
                      date: '',
                      image: null,
                      registerLink: '',
                    });
                    setError(null);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAnnouncementSubmit} className="space-y-4" encType="multipart/form-data">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={announcementForm.title}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={announcementForm.description}
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={announcementForm.category}
                    onChange={(e) =>
                      setAnnouncementForm({ ...announcementForm, category: e.target.value, registerLink: '' })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Venue (Optional)</label>
                    <input
                      type="text"
                      value={announcementForm.venue}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, venue: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date (Optional)</label>
                    <input
                      type="date"
                      value={announcementForm.date}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, date: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Time (Optional)</label>
                    <input
                      type="time"
                      value={announcementForm.startTime}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, startTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Time (Optional)</label>
                    <input
                      type="time"
                      value={announcementForm.endTime}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, endTime: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {showRegisterLink && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Register Link (Optional)</label>
                    <input
                      type="url"
                      value={announcementForm.registerLink}
                      onChange={(e) => setAnnouncementForm({ ...announcementForm, registerLink: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image (Optional)</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={(e) => setAnnouncementForm({ ...announcementForm, image: e.target.files[0] })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowAnnouncementForm(false);
                      setEditingAnnouncement(null);
                      setError(null);
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingAnnouncement ? 'Update' : 'Create'} Announcement
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {announcements.map((announcement) => {
          console.log('Rendering announcement:', announcement); // Debug log
          return (
            <div
              key={announcement._id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-full w-full min-h-[300px]"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{announcement.title}</h3>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {announcement.category}
                    </span>
                  </div>
                  <p className="text-gray-700 mb-3">{announcement.description}</p>
                  <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {announcement.date || formatDate(announcement.createdAt)}
                    </span>
                    {announcement.venue && (
                      <span className="flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {announcement.venue}
                      </span>
                    )}
                    {(announcement.startTime || announcement.endTime) && (
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {announcement.startTime && announcement.endTime
                          ? `${announcement.startTime} - ${announcement.endTime}`
                          : announcement.startTime || announcement.endTime || announcement.time}
                      </span>
                    )}
                    {announcement.time && !announcement.startTime && !announcement.endTime && (
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {announcement.time}
                      </span>
                    )}
                    {announcement.registerLink && (
                      <span className="flex items-center">
                        <Link size={16} className="mr-1" />
                        <a
                          href={announcement.registerLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Register
                        </a>
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => editAnnouncement(announcement)}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => deleteAnnouncement(announcement._id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              {announcement.image && (
                <img
                  src={announcement.image}
                  alt={announcement.title}
                  className="w-full h-48 object-cover rounded-lg mt-4"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnnouncementsSection;