import React, { useState, useMemo, useEffect } from 'react';
import { Home, Users, MessageSquare, Megaphone, Settings, Menu } from 'lucide-react';
import Sidebar from '../components/AdminDashboard/Sidebar';
import DashboardSection from '../components/AdminDashboard/DashboardSection';
import AnnouncementsSection from '../components/AdminDashboard/AnnouncementsSection';
import ComplaintsSection from '../components/AdminDashboard/ComplaintsSection ';
import UsersSection from '../components/AdminDashboard/UsersSection';
import SettingsSection from '../components/AdminDashboard/SettingsSection';

const AdminDashboardPage = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showAnnouncementForm, setShowAnnouncementForm] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    content: '',
    category: 'General',
    venue: '',
    time: '',
    image: null,
    registerLink: '',
  });
  const [complaints, setComplaints] = useState([]);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintForm, setComplaintForm] = useState({ title: '', description: '' });
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    studentId: '',
    department: 'Computer Science',
    year: '1st Year',
    role: 'Student',
    phone: '',
    accommodation: 'Dayscholar',
    profileImage: '',
  });
  const [userFilter, setUserFilter] = useState({ role: 'all', accommodation: 'all', department: 'all' });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'complaints', label: 'Complaints', icon: MessageSquare },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const categories = ['General', 'Event', 'Exam', 'Holiday', 'Hackathon', 'Internship', 'Tech News'];
  const complaintCategories = ['Water', 'Electricity', 'Cleaning', 'Maintenance', 'Internet', 'Security', 'Other'];
  const departments = ['Computer Science', 'Electronics', 'Mechanical', 'Civil', 'Chemical'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

  // Fetch announcements from backend
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/announcements', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch announcements');
        setAnnouncements(data);
      } catch (err) {
        console.error('Fetch announcements error:', err);
      }
    };
    fetchAnnouncements();
  }, []);

  // Fetch users from backend
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch users');
        setUsers(data.map((user) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          studentId: user.rollNo || '',
          department: user.dept || '',
          year: user.year || '',
          role: user.role,
          phone: user.phoneNo || '',
          accommodation: user.accommodation || '',
          profileImage: user.profileImage || '',
          joinDate: user.createdAt || new Date().toISOString(),
          lastLogin: user.lastLogin || null,
        })));
      } catch (err) {
        console.error('Fetch users error:', err);
      }
    };
    fetchUsers();
  }, []);

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/complaints', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch complaints');
        setComplaints(data);
      } catch (err) {
        console.error('Fetch complaints error:', err);
      }
    };
    fetchComplaints();
  }, []);

  // Stats calculations
  const stats = useMemo(() => {
    const totalAnnouncements = announcements.length;
    const totalComplaints = complaints.length;
    const pendingComplaints = complaints.filter((c) => c.status === 'pending').length;
    const resolvedComplaints = complaints.filter((c) => c.status === 'resolved').length;
    const totalUsers = users.length;

    return {
      totalAnnouncements,
      totalComplaints,
      pendingComplaints,
      resolvedComplaints,
      totalUsers,
    };
  }, [announcements, complaints, users]);

  // Filtered users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      return (
        (userFilter.role === 'all' || user.role === userFilter.role) &&
        (userFilter.accommodation === 'all' || user.accommodation === userFilter.accommodation) &&
        (userFilter.department === 'all' || user.department === userFilter.department)
      );
    });
  }, [users, userFilter]);

  // Handlers
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Menu size={24} />
          </button>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          {activeSection === 'dashboard' && (
            <DashboardSection
              announcements={announcements}
              complaints={complaints}
              stats={stats}
              setActiveSection={setActiveSection}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          )}
          {activeSection === 'announcements' && (
            <AnnouncementsSection
              announcements={announcements}
              setAnnouncements={setAnnouncements}
              showAnnouncementForm={showAnnouncementForm}
              setShowAnnouncementForm={setShowAnnouncementForm}
              editingAnnouncement={editingAnnouncement}
              setEditingAnnouncement={setEditingAnnouncement}
              announcementForm={announcementForm}
              setAnnouncementForm={setAnnouncementForm}
              categories={categories}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          )}
          {activeSection === 'complaints' && (
            <ComplaintsSection
              complaints={complaints}
              setComplaints={setComplaints}
              showComplaintForm={showComplaintForm}
              setShowComplaintForm={setShowComplaintForm}
              complaintForm={complaintForm}
              setComplaintForm={setComplaintForm}
              complaintCategories={complaintCategories}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          )}
          {activeSection === 'users' && (
            <UsersSection
              users={users}
              setUsers={setUsers}
              showUserForm={showUserForm}
              setShowUserForm={setShowUserForm}
              editingUser={editingUser}
              setEditingUser={setEditingUser}
              userForm={userForm}
              setUserForm={setUserForm}
              userFilter={userFilter}
              setUserFilter={setUserFilter}
              filteredUsers={filteredUsers}
              departments={departments}
              years={years}
              getStatusColor={getStatusColor}
              formatDate={formatDate}
            />
          )}
          {activeSection === 'settings' && (
            <SettingsSection />
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;