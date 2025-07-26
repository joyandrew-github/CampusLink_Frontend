import React, { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';

const ComplaintsSection = ({ complaints, setComplaints, getStatusColor, getPriorityColor, formatDate }) => {
  const [error, setError] = useState('');

  // Fetch complaints for admin
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

  // Handle status update
  const updateComplaintStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/complaints/${id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update complaint status');
      }

      setComplaints(complaints.map(c => (c._id === data._id ? data : c)));
    } catch (err) {
      setError(err.message || 'An error occurred while updating status');
      console.error('Update status error:', err);
    }
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
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Complaints Management</h2>
        <p className="text-gray-600">Monitor and resolve student complaints</p>
      </div>

      <div className="space-y-4">
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
        {complaints.map((complaint) => (
          <div key={complaint._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">{complaint.title}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(complaint.status)}`}>
                    {complaint.status.charAt(0).toUpperCase() + complaint.status.slice(1)}
                  </span>
                </div>
                <p className="text-gray-700 mb-3">{complaint.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Student:</span>
                    <p>{complaint.submittedBy?.name || 'Unknown'}</p>
                  </div>
                  <div>
                    <span className="font-medium">Room:</span>
                    <p>{complaint.room}</p>
                  </div>
                  <div>
                    <span className="font-medium">Category:</span>
                    <p>{complaint.category}</p>
                  </div>
                  <div>
                    <span className="font-medium">Date:</span>
                    <p>{formatDate(complaint.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <span className="text-sm text-gray-500">
                Complaint ID: #{complaint._id.toString().slice(-4)}
              </span>
              <div className="flex space-x-2">
                {complaint.status === 'pending' && (
                  <button
                    onClick={() => updateComplaintStatus(complaint._id, 'in_progress')}
                    className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 transition-colors"
                  >
                    Start Progress
                  </button>
                )}
                {complaint.status === 'in_progress' && (
                  <button
                    onClick={() => updateComplaintStatus(complaint._id, 'resolved')}
                    className="px-3 py-1 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
                  >
                    Mark Resolved
                  </button>
                )}
                {complaint.status === 'resolved' && (
                  <button
                    onClick={() => updateComplaintStatus(complaint._id, 'pending')}
                    className="px-3 py-1 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-700 transition-colors"
                  >
                    Reopen
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComplaintsSection;