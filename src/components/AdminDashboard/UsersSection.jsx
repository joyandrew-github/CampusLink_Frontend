import React, { useState, useEffect } from 'react';
import { Users, Edit, UserPlus, Trash2, X, Upload } from 'lucide-react';

// Map string years to numeric values for backend
const yearMap = {
  '1st Year': 1,
  '2nd Year': 2,
  '3rd Year': 3,
  '4th Year': 4,
};

// Map numeric years back to strings for display
const reverseYearMap = {
  1: '1st Year',
  2: '2nd Year',
  3: '3rd Year',
  4: '4th Year',
};

const UsersSection = ({
  users,
  setUsers,
  showUserForm,
  setShowUserForm,
  editingUser,
  setEditingUser,
  userForm,
  setUserForm,
  userFilter,
  setUserFilter,
  departments,
  years,
  formatDate,
}) => {
  const [error, setError] = useState('');

  // Compute filtered users based on userFilter
  const filteredUsers = users.filter((user) => {
    const matchesDepartment =
      userFilter.department === 'all' || user.dept === userFilter.department;
    const matchesAccommodation =
      userFilter.accommodation === 'all' || user.accommodation === userFilter.accommodation;
    return matchesDepartment && matchesAccommodation;
  });

  // Fetch users from backend on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/auth/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch users');
        }
        // Map numeric year to string for display
        const mappedUsers = data.map((user) => ({
          ...user,
          year: user.year ? reverseYearMap[user.year] || user.year : '',
        }));
        setUsers (mappedUsers);
      } catch (err) {
        setError(err.message || 'An error occurred while fetching users');
        console.error('Fetch users error:', err);
      }
    };

    fetchUsers();
  }, [setUsers]);

  // Handle user form submission (create or update)
  const handleUserSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!userForm.name || !userForm.email || !userForm.studentId || !userForm.phone) {
      setError('Name, email, student ID, and phone are required');
      return;
    }
    // Validate password for new users
    if (!editingUser && (!userForm.password || userForm.password.length < 6)) {
      setError('Password is required for new users and must be at least 6 characters');
      return;
    }
    // Validate password for updates (if provided)
    if (editingUser && userForm.password && userForm.password.length < 6) {
      setError('Password must be at least 6 characters if provided');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const formData = new FormData();
      formData.append('name', userForm.name);
      formData.append('email', userForm.email);
      formData.append('rollNo', userForm.studentId);
      formData.append('dept', userForm.department);
      formData.append('year', yearMap[userForm.year] || '');
      formData.append('role', userForm.role);
      formData.append('phoneNo', userForm.phone);
      formData.append('accommodation', userForm.accommodation);
      // Include password if provided
      if (userForm.password) {
        formData.append('password', userForm.password);
      }
      if (userForm.image && typeof userForm.image !== 'string') {
        formData.append('profileImage', userForm.image);
      }

      const url = editingUser
        ? `https://campuslink-backend-7auz.onrender.com/api/auth/users/${editingUser._id}`
        : 'https://campuslink-backend-7auz.onrender.com/api/auth/student/register';
      const method = editingUser ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Failed to ${editingUser ? 'update' : 'create'} user`);
      }

      // Map numeric year back to string for display
      const updatedUser = {
        ...data,
        name: data.name || localStorage.getItem('userName') || 'Unknown',
        year: data.year ? reverseYearMap[data.year] || data.year : '',
      };

      if (editingUser) {
        setUsers(users.map((u) => (u._id === data._id ? updatedUser : u)));
      } else {
        setUsers([...users, updatedUser]);
      }

      setUserForm({
        name: '',
        email: '',
        studentId: '',
        department: 'Computer Science',
        year: '1st Year',
        role: 'Student',
        phone: '',
        accommodation: 'Dayscholar',
        image: '',
        password: '', // Reset password field
      });
      setEditingUser(null);
      setShowUserForm(false);
    } catch (err) {
      setError(err.message || `An error occurred while ${editingUser ? 'updating' : 'creating'} user`);
      console.error('User submit error:', err);
    }
  };

  // Handle user edit
  const editUser = (user) => {
    setUserForm({
      name: user.name,
      email: user.email,
      studentId: user.rollNo || '',
      department: user.dept || 'Computer Science',
      year: user.year || '1st Year',
      role: user.role || 'Student',
      phone: user.phoneNo || '',
      accommodation: user.accommodation || 'Dayscholar',
      image: user.profileImage || '',
      password: '', // Password is empty for edits
    });
    setEditingUser(user);
    setShowUserForm(true);
  };

  // Handle user deletion
  const deleteUser = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }
        const response = await fetch(`https://campuslink-backend-7auz.onrender.com/api/auth/users/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) {
          throw new Error('Failed to delete user');
        }

        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        setError(err.message || 'An error occurred while deleting user');
        console.error('Delete user error:', err);
      }
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserForm({ ...userForm, image: file });
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
          <p className="text-gray-600">Manage student accounts</p>
        </div>
        <button
          onClick={() => {
            setUserForm({
              name: '',
              email: '',
              studentId: '',
              department: 'Computer Science',
              year: '1st Year',
              role: 'Student',
              phone: '',
              accommodation: 'Dayscholar',
              image: '',
              password: '',
            });
            setEditingUser(null);
            setShowUserForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
        >
          <UserPlus size={20} className="mr-2" />
          Add User
        </button>
      </div>

      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
            <select
              value={userFilter.accommodation}
              onChange={(e) => setUserFilter({ ...userFilter, accommodation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Accommodation</option>
              <option value="Dayscholar">Dayscholar</option>
              <option value="Hosteller">Hosteller</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <select
              value={userFilter.department}
              onChange={(e) => setUserFilter({ ...userFilter, department: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {showUserForm && (
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
                  {editingUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => {
                    setShowUserForm(false);
                    setEditingUser(null);
                    setUserForm({
                      name: '',
                      email: '',
                      studentId: '',
                      department: 'Computer Science',
                      year: '1st Year',
                      role: 'Student',
                      phone: '',
                      accommodation: 'Dayscholar',
                      image: '',
                      password: '',
                    });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleUserSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={userForm.name}
                      onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      value={userForm.email}
                      onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                    <select
                      value={userForm.department}
                      onChange={(e) => setUserForm({ ...userForm, department: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                    <input
                      type="text"
                      value={userForm.studentId}
                      onChange={(e) => setUserForm({ ...userForm, studentId: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                    <select
                      value={userForm.year}
                      onChange={(e) => setUserForm({ ...userForm, year: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {years.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                    <select
                      value={userForm.accommodation}
                      onChange={(e) => setUserForm({ ...userForm, accommodation: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Dayscholar">Dayscholar</option>
                      <option value="Hosteller">Hosteller</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={userForm.phone}
                      onChange={(e) => setUserForm({ ...userForm, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Password {editingUser && '(Leave blank to keep unchanged)'}
                    </label>
                    <input
                      type="password"
                      value={userForm.password}
                      onChange={(e) => setUserForm({ ...userForm, password: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={editingUser ? 'Enter new password (optional)' : 'Enter password'}
                      required={!editingUser}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <Upload size={20} className="text-gray-500" />
                  </div>
                  {userForm.image && typeof userForm.image === 'string' && (
                    <div className="mt-2">
                      <img src={userForm.image} alt="Profile preview" className="w-24 h-24 object-cover rounded-full" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowUserForm(false);
                      setEditingUser(null);
                      setUserForm({
                        name: '',
                        email: '',
                        studentId: '',
                        department: 'Computer Science',
                        year: '1st Year',
                        role: 'Student',
                        phone: '',
                        accommodation: 'Dayscholar',
                        image: '',
                        password: '',
                      });
                    }}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingUser ? 'Update' : 'Add'} User
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accommodation</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Login</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {user.profileImage && (
                        <img src={user.profileImage} alt={`${user.name}'s profile`} className="w-10 h-10 object-cover rounded-full mr-3" />
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">
                          {user.rollNo}
                          {user.year && ` • ${user.year}`}
                          {user.accommodation && ` • ${user.accommodation}`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.dept}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.accommodation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {user.accommodation || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => editUser(user)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => deleteUser(user._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
          <p className="text-gray-500">Try adjusting your filters to see more results.</p>
        </div>
      )}
    </div>
  );
};

export default UsersSection;