import React, { useState, useEffect } from 'react';
import { Plus, MessageSquare, Clock, User, Save, CheckCircle, Edit, Trash2 } from 'lucide-react';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-10 text-red-600">
          <h2>Something went wrong!</h2>
          <p>Error: {this.state.error?.message || 'An unknown error occurred'}</p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

const ComplaintsSection = ({
  complaints,
  setComplaints,
  showComplaintForm,
  setShowComplaintForm,
  complaintForm,
  setComplaintForm,
  complaintCategories,
  getStatusColor,
}) => {
  const [error, setError] = useState('');
  const [selectedComplaint, setSelectedComplaint] = useState(null);

  // Fetch complaints based on user role
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/complaints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch complaints');
        }
        setComplaints(data);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching complaints');
        console.error('Fetch error:', err);
      }
    };

    fetchComplaints();
  }, [setComplaints]);

  // Handle complaint submission
  const handleComplaintSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!complaintForm.title || !complaintForm.description || !complaintForm.room) {
      setError('Title, description, and room are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/complaints', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: complaintForm.title,
          description: complaintForm.description,
          room: complaintForm.room,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit complaint');
      }

      setComplaints([...complaints, data]);
      setComplaintForm({ title: '', description: '', room: '' });
      setShowComplaintForm(false);
    } catch (err) {
      setError(err.message || 'An error occurred while submitting');
      console.error('Submit error:', err);
    }
  };

  // Handle update complaint
  const handleUpdateComplaint = async (e) => {
    e.preventDefault();
    setError('');

    if (!complaintForm.title || !complaintForm.description || !complaintForm.room) {
      setError('Title, description, and room are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/complaints/${selectedComplaint._id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: complaintForm.title,
          description: complaintForm.description,
          room: complaintForm.room,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update complaint');
      }

      setComplaints(complaints.map((c) => (c._id === data._id ? data : c)));
      setComplaintForm({ title: '', description: '', room: '' });
      setSelectedComplaint(null);
      setShowComplaintForm(false);
    } catch (err) {
      setError(err.message || 'An error occurred while updating');
      console.error('Update error:', err);
    }
  };

  // Handle delete complaint
  const handleDeleteComplaint = async (id) => {
    if (window.confirm('Are you sure you want to delete this complaint?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/complaints/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete complaint');
        }

        setComplaints(complaints.filter((c) => c._id !== id));
      } catch (err) {
        setError(err.message || 'An error occurred while deleting');
        console.error('Delete error:', err);
      }
    }
  };

  // Check if the current user is the complaint owner
  const currentUserId = localStorage.getItem('userId');
  const isOwner = (complaint) => {
    if (!complaint || !complaint.submittedBy || !complaint.submittedBy._id) return false;
    return currentUserId === complaint.submittedBy._id.toString();
  };

  // Fallback UI if complaints data is missing or invalid
  if (!complaints || !Array.isArray(complaints)) {
    return (
      <div className="text-center py-10 text-gray-600">
        {error ? (
          <p>Error: {error}. Please try again or refresh the page.</p>
        ) : (
          <p>Loading complaints...</p>
        )}
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Hostel Complaints</h2>
            <p className="text-gray-600 mt-1">Submit and track your hostel complaints</p>
          </div>
          <button
            onClick={() => {
              setComplaintForm({ title: '', description: '', room: '' });
              setSelectedComplaint(null);
              setShowComplaintForm(true);
            }}
            className="mt-4 sm:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>New Complaint</span>
          </button>
        </div>

        {/* Complaints List */}
        <div className="space-y-4">
          {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{complaint.title}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                        complaint.status
                      )}`}
                    >
                      {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-3">{complaint.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <MessageSquare size={16} />
                      <span>Category: {complaint.category}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>Submitted by: {complaint.submittedBy?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock size={16} />
                      <span>Date: {new Date(complaint.createdAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <User size={16} />
                      <span>Room: {complaint.room || 'Not specified'}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mt-4 lg:mt-0">
                  {complaint.status === 'resolved' ? (
                    <CheckCircle className="text-green-500" size={24} />
                  ) : complaint.status === 'in_progress' ? (
                    <Clock className="text-blue-500" size={24} />
                  ) : (
                    <Clock className="text-yellow-500" size={24} />
                  )}
                  {isOwner(complaint) && (
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedComplaint(complaint);
                          setComplaintForm({
                            title: complaint.title,
                            description: complaint.description,
                            room: complaint.room,
                          });
                          setShowComplaintForm(true);
                        }}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteComplaint(complaint._id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">
                    Complaint ID: #{complaint._id.toString().slice(-4)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add/Edit Complaint Modal */}
        {showComplaintForm && (
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
            <div className="bg-white rounded-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                {selectedComplaint ? 'Edit Complaint' : 'Submit New Complaint'}
              </h3>
              {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
              <form
                onSubmit={selectedComplaint ? handleUpdateComplaint : handleComplaintSubmit}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={complaintForm.title}
                    onChange={(e) => setComplaintForm({ ...complaintForm, title: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the issue"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    value={complaintForm.description}
                    onChange={(e) => setComplaintForm({ ...complaintForm, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Detailed description of the problem"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                  <input
                    type="text"
                    value={complaintForm.room}
                    onChange={(e) => setComplaintForm({ ...complaintForm, room: e.target.value })}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter room number"
                    required
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Save size={16} />
                    <span>{selectedComplaint ? 'Update' : 'Submit'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowComplaintForm(false);
                      setSelectedComplaint(null);
                      setComplaintForm({ title: '', description: '', room: '' });
                    }}
                    className="flex-1 bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center"
                  >
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default ComplaintsSection;