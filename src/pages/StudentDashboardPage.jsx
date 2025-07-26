import React, { useState, useMemo, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Home, Search, Calendar, MessageSquare, User, Settings, Bell, Package, Clock, AlertTriangle, Menu
} from 'lucide-react';
import Sidebar from '../components/StudentDashboard/Sidebar';
import DashboardSection from '../components/StudentDashboard/DashboardSection';
import LostAndFoundSection from '../components/StudentDashboard/LostAndFoundSection';
import TimetableSection from '../components/StudentDashboard/TimetableSection';
import ComplaintsSection from '../components/StudentDashboard/ComplaintsSection';
import ProfileSection from '../components/StudentDashboard/ProfileSection';
import SettingsSection from '../components/StudentDashboard/SettingsSection';

const Dashboard = () => {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [error, setError] = useState('');
  const [selectedItem, setSelectedItem] = useState(null); // For lost and found editing

  // Lost & Found State
  const [lostFoundItems, setLostFoundItems] = useState([]);
  const [lostFoundFilter, setLostFoundFilter] = useState({ category: 'all', status: 'all', otherCategory: '', sortBy: 'newest' });
  const [showLostFoundForm, setShowLostFoundForm] = useState(false);
  const [lostFoundForm, setLostFoundForm] = useState({
    itemName: '',
    description: '',
    category: 'electronics',
    otherCategory: '',
    status: 'lost',
    location: '',
    date: new Date().toISOString().split('T')[0],
    image: null,
  });

  // Timetable State
  const [timetable, setTimetable] = useState([]);
  const [showTimetableForm, setShowTimetableForm] = useState(false);
  const [timetableForm, setTimetableForm] = useState({
    weekIndex: 0,
    subject: '',
    professor: '',
    day: 'Monday',
    startTime: '',
    endTime: '',
    room: '',
    type: 'Lecture',
  });
  const [editingTimetable, setEditingTimetable] = useState(null);
  const [currentDate] = useState(new Date(2025, 6, 1)); // Fixed to July 1, 2025
  const [isLoadingTimetable, setIsLoadingTimetable] = useState(false);

  // Complaints State
  const [complaints, setComplaints] = useState([]);
  const [showComplaintForm, setShowComplaintForm] = useState(false);
  const [complaintForm, setComplaintForm] = useState({
    title: '',
    description: '',
    room: '',
  });

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'lost-found', label: 'Lost & Found', icon: Search },
    { id: 'timetable', label: 'Timetable', icon: Calendar },
    { id: 'complaints', label: 'Hostel Complaints', icon: MessageSquare },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const categories = ['electronics', 'books', 'clothing', 'personal', 'other'];
  const complaintCategories = [
    'cleaning', 'maintenance', 'food', 'noise', 'staff', 'water', 'electricity',
    'wifi issue', 'room condition', 'washroom issue', 'laundry', 'security',
    'pest control', 'air conditioning', 'fan or light not working',
    'bed or furniture damage', 'mess timing', 'power backup', 'waste disposal',
    'drinking water', 'plumbing', 'other',
  ];

  // Fetch timetable on mount
  useEffect(() => {
    const fetchTimetable = async () => {
      setIsLoadingTimetable(true);
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/timetable', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch timetable');
        setTimetable(data.schedule || []);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setIsLoadingTimetable(false);
      }
    };
    fetchTimetable();
  }, []);

  // Fetch complaints on mount
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
        setError(err.message);
        toast.error(err.message);
      }
    };
    fetchComplaints();
  }, []);

  // Fetch lost and found items on mount
  useEffect(() => {
    const fetchLostFoundItems = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No authentication token found');
        const response = await fetch('https://campuslink-backend-7auz.onrender.com/api/lostfound', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Failed to fetch lost/found items');
        setLostFoundItems(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message);
      }
    };
    fetchLostFoundItems();
  }, []);

  // Filtered Lost & Found Items
  const filteredLostFoundItems = useMemo(() => {
    return lostFoundItems
      .filter(item => (
        (lostFoundFilter.category === 'all' || item.category === lostFoundFilter.category) &&
        (lostFoundFilter.status === 'all' || item.status === lostFoundFilter.status) &&
        (lostFoundFilter.otherCategory === '' || item.otherCategory === lostFoundFilter.otherCategory)
      ))
      .sort((a, b) => {
        if (lostFoundFilter.sortBy === 'newest') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return new Date(a.createdAt) - new Date(b.createdAt);
      });
  }, [lostFoundItems, lostFoundFilter]);

  // Quick Stats
  const quickStats = useMemo(() => [
    {
      label: 'Active Complaints',
      value: complaints.filter(c => c.status !== 'resolved').length,
      icon: AlertTriangle,
      color: 'text-orange-600 bg-orange-50',
    },
    {
      label: 'Lost Items Found',
      value: lostFoundItems.filter(i => i.status === 'found').length,
      icon: Package,
      color: 'text-green-600 bg-green-50',
    },
    {
      label: 'Classes This Week',
      value: timetable[0] ? Object.values(timetable[0]).flat().length : 0,
      icon: Clock,
      color: 'text-blue-600 bg-blue-50',
    },
    {
      label: 'Lost Reports',
      value: lostFoundItems.filter(i => i.status === 'lost').length,
      icon: Bell,
      color: 'text-purple-600 bg-purple-50',
    },
  ], [complaints, lostFoundItems, timetable]);

  // Handlers
  const handleLostFoundSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (lostFoundForm.category === 'other' && !lostFoundForm.otherCategory.trim()) {
      setError('Other category is required when category is "other"');
      toast.error('Other category is required when category is "other"');
      return;
    }
    if (lostFoundForm.category !== 'other' && lostFoundForm.otherCategory.trim()) {
      setError('Other category must be empty when category is not "other"');
      toast.error('Other category must be empty when category is not "other"');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('itemName', lostFoundForm.itemName);
    formDataToSend.append('description', lostFoundForm.description);
    formDataToSend.append('category', lostFoundForm.category);
    formDataToSend.append('otherCategory', lostFoundForm.category === 'other' ? lostFoundForm.otherCategory : '');
    formDataToSend.append('status', lostFoundForm.status);
    formDataToSend.append('location', lostFoundForm.location);
    formDataToSend.append('date', lostFoundForm.date);
    if (lostFoundForm.image) {
      formDataToSend.append('image', lostFoundForm.image);
    }

    try {
      const token = localStorage.getItem('token');
      const url = selectedItem ? `https://campuslink-backend-7auz.onrender.com/api/lostfound/${selectedItem._id}` : 'https://campuslink-backend-7auz.onrender.com/api/lostfound';
      const method = selectedItem ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to submit lost/found item');

      setLostFoundItems(selectedItem
        ? lostFoundItems.map(item => item._id === data._id ? data : item)
        : [...lostFoundItems, data]);
      setLostFoundForm({
        itemName: '',
        description: '',
        category: 'electronics',
        otherCategory: '',
        status: 'lost',
        location: '',
        date: new Date().toISOString().split('T')[0],
        image: null,
      });
      setShowLostFoundForm(false);
      setSelectedItem(null);
      toast.success(selectedItem ? 'Item updated successfully!' : 'Item added successfully!');
    } catch (err) {
      setError(err.message);
      toast.error(err.message);
    }
  };

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

  return (
    <div className="flex h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <Sidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        menuItems={menuItems}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-800">
            <Menu size={24} />
          </button>
        </div>
        <main className="flex-1 overflow-y-auto p-6">
          {error && <div className="text-red-500 mb-4">{error}</div>}
          {activeSection === 'dashboard' && (
            <DashboardSection quickStats={quickStats} setActiveSection={setActiveSection} />
          )}
          {activeSection === 'lost-found' && (
            <LostAndFoundSection
              lostFoundItems={filteredLostFoundItems}
              lostFoundFilter={lostFoundFilter}
              setLostFoundFilter={setLostFoundFilter}
              showLostFoundForm={showLostFoundForm}
              setShowLostFoundForm={setShowLostFoundForm}
              lostFoundForm={lostFoundForm}
              setLostFoundForm={setLostFoundForm}
              handleLostFoundSubmit={handleLostFoundSubmit}
              setSelectedItem={setSelectedItem}
              categories={categories}
            />
          )}
          {activeSection === 'timetable' && (
            <TimetableSection
              timetable={timetable}
              setTimetable={setTimetable}
              showTimetableForm={showTimetableForm}
              setShowTimetableForm={setShowTimetableForm}
              timetableForm={timetableForm}
              setTimetableForm={setTimetableForm}
              editingTimetable={editingTimetable}
              setEditingTimetable={setEditingTimetable}
              isLoadingTimetable={isLoadingTimetable}
              days={days}
              currentDate={currentDate}
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
            />
          )}
          {activeSection === 'profile' && <ProfileSection />}
          {activeSection === 'settings' && <SettingsSection />}
        </main>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Dashboard;